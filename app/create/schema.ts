import { z } from "zod";

const formSchema = z.object({
  city: z.string().min(1, "Qyteti është i detyrueshëm"),
  neighborhood: z.string().min(1, "Lagja është e detyrueshme"),
  title: z.string().min(1, "Titulli është i detyrueshëm"),
  description: z.string().min(1, "Përshkrimi është i detyrueshëm"),
  price: z.string().min(1, "Çmimi është i detyrueshëm"),
});

export default formSchema;
