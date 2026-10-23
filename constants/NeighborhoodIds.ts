// Neighborhood names repeat across cities ("City Center", "Fidanishte"…), so filters use "City|Name" ids
export const neighborhoodId = (city: string, name: string) => `${city}|${name}`;

export const parseNeighborhoodId = (id: string) => {
  const [city, ...rest] = id.split('|');
  return { city, name: rest.join('|') };
};
