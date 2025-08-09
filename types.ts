export interface User {
  id: string;
  username: string;
  password: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  image: any;
  city: string;
  price: number;
  neighborhood: string;
  user: User;
}
