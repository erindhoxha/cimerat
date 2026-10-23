// Kosovo's municipal centres, roughly by population. "Suhareke" keeps its stored spelling (existing listings use it).
export const cities = [
  'Prishtina',
  'Prizren',
  'Ferizaj',
  'Peja',
  'Gjakova',
  'Gjilan',
  'Mitrovica',
  'Podujevë',
  'Vushtrri',
  'Suhareke',
  'Rahovec',
  'Drenas',
  'Lipjan',
  'Malishevë',
  'Skenderaj',
  'Viti',
  'Deçan',
  'Istog',
  'Klinë',
  'Kamenicë',
  'Dragash',
  'Kaçanik',
  'Fushë Kosovë',
  'Obiliq',
  'Shtime',
];

// Indefinite form used after "në" (e.g. "në Pejë", "në Prishtinë"); names like Ferizaj don't change
const CITY_LOCATIVE: Record<string, string> = {
  Prishtina: 'Prishtinë',
  Peja: 'Pejë',
  Mitrovica: 'Mitrovicë',
  Gjakova: 'Gjakovë',
  Suhareke: 'Suharekë',
};

export const cityAfterNe = (city: string) =>
  CITY_LOCATIVE[city] ?? (city.endsWith('a') ? `${city.slice(0, -1)}ë` : city);
