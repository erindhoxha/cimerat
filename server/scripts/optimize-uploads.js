// One-off: applies EXIF rotation and resizes existing uploads in place (filenames are kept,
// so the paths stored in MongoDB keep working). Run from the project root:
//   node server/scripts/optimize-uploads.js
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads');
const MAX_IMAGE_SIZE = 1600;

async function main() {
  const files = fs.readdirSync(UPLOAD_DIR).filter((f) => !f.startsWith('.'));
  let before = 0;
  let after = 0;

  for (const file of files) {
    const filePath = path.join(UPLOAD_DIR, file);
    const input = fs.readFileSync(filePath);
    try {
      const output = await sharp(input)
        .rotate()
        .resize(MAX_IMAGE_SIZE, MAX_IMAGE_SIZE, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 82, progressive: true, mozjpeg: true })
        .toBuffer();

      if (output.length < input.length) {
        fs.writeFileSync(filePath, output);
        before += input.length;
        after += output.length;
      }
    } catch (error) {
      console.warn(`Skipping ${file}: ${error.message}`);
    }
  }

  const mb = (n) => (n / 1024 / 1024).toFixed(1);
  console.log(`Optimized ${files.length} files: ${mb(before)}MB -> ${mb(after)}MB`);
}

main();
