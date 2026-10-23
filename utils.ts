import { differenceInDays, format } from 'date-fns';
import { sq } from 'date-fns/locale';
import { Listing, ImageType } from '@/types';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

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

  console.log('IMAGES', images);

  images.forEach((img, idx) => {
    formData.append('images', {
      uri: img.uri,
      type: img.type || 'image/jpeg',
      name: img.name || `photo_${idx}.jpg`,
    } as any);
  });

  return formData;
};

export const formatKosovoPhone = (phone: string) => {
  const phoneNumber = parsePhoneNumberFromString(phone, 'XK');
  return phoneNumber ? phoneNumber.formatInternational() : phone;
};

// "+38348123456" form, needed for WhatsApp/Viber deep links
export const toE164 = (phone: string) => parsePhoneNumberFromString(phone, 'XK')?.number ?? phone.replace(/[^0-9+]/g, '');

export const listingHasExpired = (createdAt?: Date) => {
  if (!createdAt) {
    return undefined;
  }
  return createdAt && differenceInDays(new Date(), new Date(createdAt)) > 14;
};

// Full name when the user has set one, otherwise their username
export const displayName = (user?: { username?: string; fullName?: string | null } | null) =>
  user?.fullName?.trim() || user?.username || '';

// fetch() can't report upload progress, XMLHttpRequest can. Resolves with the parsed JSON body;
// rejects with an Error carrying the server's message.
export const uploadForm = ({
  url,
  method,
  body,
  token,
  onProgress,
}: {
  url: string;
  method: 'POST' | 'PUT';
  body: FormData;
  token?: string | null;
  onProgress?: (fraction: number) => void;
}) =>
  new Promise<any>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress?.(event.loaded / event.total);
    };
    xhr.onload = () => {
      let json: any = {};
      try {
        json = JSON.parse(xhr.responseText);
      } catch {}
      if (xhr.status >= 200 && xhr.status < 300) resolve(json);
      else reject(new Error(json.error || 'Gabim gjatë ngarkimit. Ju lutemi provoni përsëri.'));
    };
    xhr.onerror = () => reject(new Error('Nuk mund të lidhemi me serverin. Kontrolloni internetin.'));
    xhr.send(body);
  });
