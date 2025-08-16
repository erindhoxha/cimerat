import { isValidPhoneNumber } from 'libphonenumber-js';
import { z } from 'zod';

const formSchema = z.object({
  city: z.string().min(1, 'Qyteti është i detyrueshëm'),
  neighborhood: z.string().min(1, 'Lagja është e detyrueshme'),
  description: z.string().min(1, 'Përshkrimi është i detyrueshëm'),
  price: z.string().min(1, 'Çmimi është i detyrueshëm'),
  phone: z
    .string({
      error: 'Numri i telefonit është i detyrueshëm',
    })
    .min(1, 'Numri i telefonit është i detyrueshëm')
    .refine((val) => isValidPhoneNumber(val, 'XK'), 'Numri duhet të jetë valid për Kosovë'),
  images: z
    .array(
      z.object({
        type: z.string().optional(),
        uri: z.string().min(1, 'Fotoja është e detyrueshme'),
        name: z.string().min(1, 'Emri i fotos është i detyrueshëm'),
      }),
    )
    .min(1, 'Duhet të ngarkoni së paku një foto'),
});

export default formSchema;
