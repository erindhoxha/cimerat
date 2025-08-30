import { differenceInDays, format } from 'date-fns';
import { sq } from 'date-fns/locale';
import { Listing, ImageType } from '@/types';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { Platform } from 'react-native';

export const formatDate = (date: Date) => {
  return format(date, 'd MMMM, yyyy', { locale: sq });
};

function base64ToBlob(base64: string, type = 'image/jpeg') {
  const byteString = atob(base64.split(',')[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type });
}

const isWeb = Platform.OS === 'web';

export const buildListingFormData = async (
  data: Omit<Listing, '_id' | 'user' | 'createdAt' | 'updatedAt'>,
  images: ImageType[],
) => {
  const formData = new FormData();

  Object.entries(data).forEach(([k, v]) => {
    if (v !== undefined && v !== null && k !== 'images') {
      formData.append(k, v as string);
    }
  });

  if (isWeb) {
    for (let idx = 0; idx < images.length; idx++) {
      const img = images[idx];
      if (img instanceof File) {
        formData.append('images', img);
      } else if (img.uri && img.uri.startsWith('http')) {
        // Fetch the image and append as blob
        const response = await fetch(img.uri);
        const blob = await response.blob();
        formData.append('images', blob, img.name || `photo_${idx}.jpg`);
      } else if (img.uri && img.uri.startsWith('data:')) {
        const type = img.type || 'image/jpeg';
        const blob = base64ToBlob(img.uri, type);
        formData.append('images', blob, img.name || `photo_${idx}.jpg`);
      }
    }
  } else {
    images.forEach((img, idx) => {
      formData.append('images', {
        uri: img.uri,
        type: img.type || 'image/jpeg',
        name: img.name || `photo_${idx}.jpg`,
      } as any);
    });
  }

  return formData;
};

export const formatKosovoPhone = (phone: string) => {
  const phoneNumber = parsePhoneNumberFromString(phone, 'XK');
  return phoneNumber ? phoneNumber.formatInternational() : phone;
};

export const listingHasExpired = (createdAt?: Date) => {
  if (!createdAt) {
    return undefined;
  }
  return createdAt && differenceInDays(new Date(), new Date(createdAt)) > 14;
};
