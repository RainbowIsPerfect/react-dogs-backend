import { z } from 'zod';
import { Types } from 'mongoose';
import { SORTING_VALUES } from './constants';
import { ProductQueryParams } from './products/products.validations';

/* User types */

export interface UserType {
  email: string;
  password: string;
  name: string;
  avatar: string;
  group: string;
  about: string;
}

export type UserWithId = WithId<UserType>;
export type SignInUserType = Pick<UserType, 'password' | 'email'>;
export type UserInfoType = Pick<UserType, 'about' | 'avatar' | 'name'>;
export type UserWithoutPassword = Omit<UserWithId, 'password'>;
export type SignInData = {
  data: UserWithoutPassword;
  token: string;
};

/* Products types */

interface Timestamps {
  createdAt?: Date;
  updatedAt?: Date;
}

export interface NewReviewType {
  rating: number;
  text: string;
}
// Types.ObjectId

export interface ReviewType extends NewReviewType, Timestamps {
  product: string;
  author: UserWithoutPassword;
}

export type ReviewWithId = WithId<ReviewType>;

export interface NewProduct {
  discount: number;
  stock: number;
  available: boolean;
  pictures: string;
  tags: string[];
  isPublished: boolean;
  name: string;
  price: number;
  wight: string;
  description: string;
}

export interface ProductType extends NewProduct, Timestamps {
  likes: string[];
  author: UserWithoutPassword;
  reviews: ReviewWithId[];
  avgRating: number;
}

export type ProductWithId = WithId<ProductType>;

export type ProductsWithTotal = {
  total: number;
  products: ProductType[];
};

export type LocalsType = { user: UserWithoutPassword };

export type SortingValues = (typeof SORTING_VALUES)[number];

export type RequestQuery = {
  query: string;
  limit: string;
  page: string;
  sort: SortingValues;
};

export type ParamsWithId = {
  id: string;
};

export type ParamsWithIdAndReview = ParamsWithId & {
  reviewId: string;
};

export type ProductsQueryParams = Omit<
  z.infer<typeof ProductQueryParams>,
  'sort'
> & { sort: SortingValues };

type WithId<T> = T & { _id: Types.ObjectId };
