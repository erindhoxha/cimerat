export interface User {
  _id: string;
  username: string;
  password: string;
}

export interface Listing {
  _id: string;
  description: string;
  images: any;
  city: string;
  price: string;
  neighborhood: string;
  user: User;
  createdAt: Date;
  updatedAt: Date;
  blurhash?: string;
  blurhashes?: string[];
}
