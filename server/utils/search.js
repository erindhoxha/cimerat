const User = require('../models/User');

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Makes a word match regardless of Albanian diacritics and case endings:
// "peje", "pejë" and "Peja" all match "Peja"; "ç"/"c" and "ë"/"e" are interchangeable.
const wordPattern = (word) => {
  let stem = word.toLowerCase();
  if (stem.length >= 4 && /[aeë]$/.test(stem)) stem = stem.slice(0, -1);
  const pattern = escapeRegex(stem)
    .replace(/[eë]/g, '[eë]')
    .replace(/[cç]/g, '[cç]');
  return new RegExp(pattern, 'i');
};

/**
 * Builds a Mongo filter where every word of `q` must match at least one field.
 * textFields are matched with the fuzzy pattern, numberFields match a numeric word exactly
 * (or approximately for prices), and users are matched by username / full name.
 */
const buildSearchFilter = async (q, { textFields, numberFields = [], approxNumberFields = [], userField = 'user' }) => {
  const words = String(q || '')
    .trim()
    .split(/[\s,]+/)
    .filter(Boolean)
    .slice(0, 6);
  if (!words.length) return {};

  const clauses = await Promise.all(
    words.map(async (word) => {
      const regex = wordPattern(word);
      const or = textFields.map((field) => ({ [field]: regex }));

      const number = Number(word.replace(/[€]/g, ''));
      if (!Number.isNaN(number) && word.replace(/[€]/g, '') !== '') {
        // Counts like rooms are stored as strings ("2", "5+")
        numberFields.forEach((field) => or.push({ [field]: String(number) }, { [field]: number }));
        // "300" finds prices around 300 (±50)
        approxNumberFields.forEach((field) => or.push({ [field]: { $gte: number - 50, $lte: number + 50 } }));
      }

      const users = await User.find({ $or: [{ username: regex }, { fullName: regex }] })
        .select('_id')
        .limit(50)
        .lean();
      if (users.length) or.push({ [userField]: { $in: users.map((u) => u._id) } });

      return { $or: or };
    }),
  );

  return { $and: clauses };
};

module.exports = { buildSearchFilter };
