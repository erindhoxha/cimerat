export interface User {
  id: string;
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
  createdAt: string;
  updatedAt: string;
}
