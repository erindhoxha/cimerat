// One-tap suggestions shown under form fields
export const POPULAR_CITIES = ['Prishtina', 'Prizren', 'Ferizaj', 'Peja', 'Gjakova', 'Gjilan'];

export const PRICE_SUGGESTIONS = ['150', '200', '250', '300', '350', '400'];

export const LISTING_FEATURES = [
  'E mobiluar',
  'Me internet',
  'Ngrohje qendrore',
  'Afër qendrës',
  'Me parking',
  'Me ballkon',
  'Shpenzimet të përfshira',
];

export const CIMER_TRAITS = ['Student', 'Punoj me orar të plotë', 'Nuk pi duhan', 'I/e qetë', 'I/e rregullt', 'Pa kafshë'];

// Appends a phrase to free text, comma-separated, unless it's already there
export const appendPhrase = (text: string | undefined, phrase: string) => {
  const current = (text ?? '').trim();
  if (current.toLowerCase().includes(phrase.toLowerCase())) return current;
  return current ? `${current.replace(/[,.\s]+$/, '')}, ${phrase.toLowerCase()}` : phrase;
};
