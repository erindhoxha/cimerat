export interface User {
  _id: string;
  username: string;
  password: string;
  verified?: boolean;
  likedListings: Listing[];
  avatar?: string | null;
  fullName?: string | null;
  /** Only present on the logged in user's own record */
  phone?: string | null;
  createdAt?: Date;
}

/** The subset of a user the API embeds in listings, posts and public profiles */
export type PublicUser = Pick<User, '_id' | 'username' | 'fullName' | 'avatar' | 'createdAt'>;

export interface CimerPost {
  _id: string;
  user: PublicUser;
  city: string;
  neighborhoods: string[];
  budget: number;
  description: string;
  gender?: string;
  age?: number;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Listing {
  _id: string;
  description: string;
  images: any;
  city: string;
  price: string;
  neighborhood: string;
  phone: string;
  user: User;
  rooms?: string;
  flatmateGender?: string;
  currentFlatmates?: string;
  createdAt: Date;
  updatedAt: Date;
  blurhash?: string;
  blurhashes?: string[];
}

export interface FormData extends Omit<Listing, '_id' | 'user' | 'createdAt' | 'updatedAt'> {}

export interface ImageType {
  uri: string;
  type?: string;
  name: string;
}
