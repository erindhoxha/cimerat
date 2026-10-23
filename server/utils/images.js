const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const sharp = require('sharp');
const { encode } = require('blurhash');
// Configures itself from the CLOUDINARY_URL env var (cloudinary://key:secret@cloud_name)
const cloudinary = require('cloudinary').v2;

const UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads');
const MAX_IMAGE_SIZE = 1600;
const AVATAR_SIZE = 512;

// Without CLOUDINARY_URL (e.g. local dev) images are written to uploads/ as before.
// Hosts like Heroku/Render wipe the local disk on restart, so production must use Cloudinary.
const useCloudinary = () => !!process.env.CLOUDINARY_URL;

const uploadToCloudinary = (buffer, folder) =>
  new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder, resource_type: 'image', format: 'jpg' }, (error, result) =>
        error ? reject(error) : resolve(result),
      )
      .end(buffer);
  });

// "https://res.cloudinary.com/<cloud>/image/upload/v123/cimerat/listings/abc.jpg" -> "cimerat/listings/abc"
const cloudinaryPublicId = (url) => {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)\.[a-z0-9]+$/i);
  return match ? match[1] : null;
};

// Expo's image picker reports the type as just "image", so don't require "image/..."
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Keep uploads in memory so sharp can orient/resize them before they hit the disk
const upload = multer({ storage: multer.memoryStorage(), fileFilter, limits: { fileSize: 20 * 1024 * 1024 } });

async function getBlurhash(input) {
  const { data, info } = await sharp(input)
    .raw()
    .ensureAlpha()
    .resize(32, 32, { fit: 'inside' })
    .toBuffer({ resolveWithObject: true });

  return encode(new Uint8ClampedArray(data), info.width, info.height, 4, 4);
}

// Applies EXIF rotation, resizes and saves as a progressive JPEG.
// Avatars are cropped to a square, listing photos keep their aspect ratio.
async function saveImage(file, { avatar = false } = {}) {
  const filename = `${crypto.randomBytes(16).toString('hex')}.jpg`;
  const image = sharp(file.buffer).rotate();
  if (avatar) {
    image.resize(AVATAR_SIZE, AVATAR_SIZE, { fit: 'cover', position: 'attention' });
  } else {
    image.resize(MAX_IMAGE_SIZE, MAX_IMAGE_SIZE, { fit: 'inside', withoutEnlargement: true });
  }
  const buffer = await image.jpeg({ quality: 82, progressive: true, mozjpeg: true }).toBuffer();
  const blurhash = await getBlurhash(buffer);

  if (useCloudinary()) {
    const result = await uploadToCloudinary(buffer, avatar ? 'cimerat/avatars' : 'cimerat/listings');
    return { path: result.secure_url, blurhash };
  }

  await fs.promises.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.promises.writeFile(path.join(UPLOAD_DIR, filename), buffer);

  return { path: `/uploads/${filename}`, blurhash };
}

// Best-effort removal of images that are no longer used (deleted listing, replaced photos/avatar).
// Never throws: a failed cleanup shouldn't fail the user's request.
async function deleteImages(paths = []) {
  await Promise.all(
    paths.filter(Boolean).map(async (imagePath) => {
      try {
        if (/^https?:\/\//.test(imagePath)) {
          const publicId = cloudinaryPublicId(imagePath);
          if (publicId && imagePath.includes('res.cloudinary.com')) await cloudinary.uploader.destroy(publicId);
        } else if (imagePath.startsWith('/uploads/')) {
          await fs.promises.unlink(path.join(UPLOAD_DIR, path.basename(imagePath)));
        }
      } catch (error) {
        console.warn(`Could not delete image ${imagePath}: ${error.message}`);
      }
    }),
  );
}

// Public fields of a user that are safe to embed in listings and posts
const PUBLIC_USER_FIELDS = 'username fullName avatar createdAt';

module.exports = { upload, saveImage, deleteImages, PUBLIC_USER_FIELDS };
