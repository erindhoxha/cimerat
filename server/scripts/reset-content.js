// Deletes all listings and cimer posts (keeps user accounts), clears favourites, and removes
// uploaded photos that no user avatar still uses. Writes a JSON backup first.
// Run from the project root:  node server/scripts/reset-content.js --yes [--backup-dir=path]
require('dotenv').config({ quiet: true });
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const User = require('../models/User');
const Listing = require('../models/Listing');
const CimerPost = require('../models/CimerPost');

const UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads');

async function main() {
  if (!process.argv.includes('--yes')) {
    console.log('This permanently deletes all listings and cimer posts. Re-run with --yes to confirm.');
    process.exit(1);
  }
  const backupArg = process.argv.find((arg) => arg.startsWith('--backup-dir='));
  const backupDir = backupArg ? backupArg.split('=')[1] : path.join(__dirname, 'backups');

  await mongoose.connect(process.env.MONGO_URI);
  console.log(`Connected to database "${mongoose.connection.db.databaseName}"`);

  const [listings, posts] = await Promise.all([Listing.find().lean(), CimerPost.find().lean()]);
  fs.mkdirSync(backupDir, { recursive: true });
  const backupFile = path.join(backupDir, `content-backup-${new Date().toISOString().replace(/[:.]/g, '-')}.json`);
  fs.writeFileSync(backupFile, JSON.stringify({ listings, posts }, null, 2));
  console.log(`Backup: ${listings.length} listings, ${posts.length} posts -> ${backupFile}`);

  const deletedListings = await Listing.deleteMany({});
  const deletedPosts = await CimerPost.deleteMany({});
  const clearedLikes = await User.updateMany({}, { $set: { likedListings: [] } });
  console.log(
    `Deleted ${deletedListings.deletedCount} listings, ${deletedPosts.deletedCount} posts; cleared favourites for ${clearedLikes.modifiedCount} users`,
  );

  // Keep photos still used as profile pictures
  const avatars = new Set(
    (await User.find({ avatar: { $ne: null } }).select('avatar').lean()).map((u) => path.basename(u.avatar)),
  );
  let removed = 0;
  for (const file of fs.readdirSync(UPLOAD_DIR)) {
    if (file.startsWith('.') || avatars.has(file)) continue;
    fs.unlinkSync(path.join(UPLOAD_DIR, file));
    removed += 1;
  }
  console.log(`Removed ${removed} photo files, kept ${avatars.size} profile photo(s)`);

  await mongoose.disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
