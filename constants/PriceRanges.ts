// Preset monthly price/budget ranges used by the Dhomat and Cimerat filters
export const PRICE_RANGES = [
  { label: 'Deri 150€', from: null, to: 150 },
  { label: '150 – 250€', from: 150, to: 250 },
  { label: '250 – 400€', from: 250, to: 400 },
  { label: '400 – 600€', from: 400, to: 600 },
  { label: 'Mbi 600€', from: 600, to: null },
] as const;

export type PriceRangeLabel = (typeof PRICE_RANGES)[number]['label'];

export const findPriceRange = (label: PriceRangeLabel | null) => PRICE_RANGES.find((range) => range.label === label);
