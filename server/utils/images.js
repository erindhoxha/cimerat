const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const sharp = require('sharp');
const { encode } = require('blurhash');

const UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads');
const MAX_IMAGE_SIZE = 1600;
const AVATAR_SIZE = 512;

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

  await fs.promises.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.promises.writeFile(path.join(UPLOAD_DIR, filename), buffer);

  return { path: `/uploads/${filename}`, blurhash: await getBlurhash(buffer) };
}

// Public fields of a user that are safe to embed in listings and posts
const PUBLIC_USER_FIELDS = 'username fullName avatar createdAt';

module.exports = { upload, saveImage, PUBLIC_USER_FIELDS };
