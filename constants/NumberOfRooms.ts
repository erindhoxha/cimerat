export const numriIDhomave = ['1', '2', '3', '4', '5+'] as const;

// Older listings stored exact counts up to 10; show those under "5+"
export const toCountOption = (value?: string | null) =>
  value && value !== 'undefined' ? (Number(value) >= 5 ? '5+' : value) : '';
