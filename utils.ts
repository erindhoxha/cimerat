import { format } from 'date-fns';
import { sq } from 'date-fns/locale';
import { Listing, ImageType } from '@/types';

export const formatDate = (date: Date) => {
  return format(date, 'd MMMM, yyyy', { locale: sq });
};

export const buildListingFormData = (
  data: Omit<Listing, '_id' | 'user' | 'createdAt' | 'updatedAt'>,
  images: ImageType[],
) => {
  const formData = new FormData();

  Object.entries(data).forEach(([k, v]) => {
    formData.append(k, v as string);
  });

  images.forEach((img, idx) => {
    formData.append('images', {
      uri: img.uri,
      type: img.type || 'image/jpeg',
      name: img.name || `photo_${idx}.jpg`,
    } as any);
  });

  return formData;
};
