import { z } from "zod";

const formSchema = z.object({
  city: z.string().min(1, "Qyteti është i detyrueshëm"),
  neighborhood: z.string().min(1, "Lagja është e detyrueshme"),
  title: z.string().min(1, "Titulli është i detyrueshëm"),
  description: z.string().min(1, "Përshkrimi është i detyrueshëm"),
  price: z.string().min(1, "Çmimi është i detyrueshëm"),
  images: z
    .array(
      z.object({
        base64: z.string().min(1, "Fotoja është e detyrueshme"),
        uri: z.string().min(1, "Fotoja është e detyrueshme"),
      }),
    )
    .min(1, "Duhet të ngarkoni së paku një foto"),
});

export default formSchema;
