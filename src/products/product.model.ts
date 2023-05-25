import { z } from 'zod';
import { db } from '../db';
import { WithId, ObjectId } from 'mongodb';

export const Author = z.object({
  name: z.string(),
  email: z.string().email(),
  avatar: z.string().url(),
  about: z.string(),
});

export const NewReview = z.object({
  rating: z.number().min(1).max(5),
  text: z.string(),
});

export const Review = NewReview.extend({
  product: z.string(),
  author: Author,
  _id: z.string(),
});

export const ProductIdParams = z.object({
  id: z
    .string()
    .nonempty()
    .refine((arg) => {
      try {
        return new ObjectId(arg);
      } catch (error) {
        return false;
      }
    }),
});

export const ReviewIdParams = ProductIdParams.extend({
  reviewId: z
    .string()
    .nonempty()
    .refine((arg) => {
      try {
        return new ObjectId(arg);
      } catch (error) {
        return false;
      }
    }),
});

export const NewProduct = z.object({
  available: z.boolean().default(true),
  isPublished: z.boolean().default(true),
  name: z.string(),
  discount: z.number().nonnegative().max(99).default(0),
  price: z.number().positive(),
  stock: z.number().nonnegative(),
  pictures: z.string().url(),
  tags: z.array(z.string()).default([]),
  description: z.string(),
  wight: z.string(),
});

export const ProductUpdate = NewProduct.partial();

export const ProductAdditionalInfo = z.object({
  likes: z.array(z.string()).default([]),
  author: Author,
  reviews: z.array(Review).default([]),
});

export const Product = NewProduct.merge(ProductAdditionalInfo);

export type NewProductType = z.infer<typeof NewProduct>;
export type ProductType = Omit<z.infer<typeof Product>, 'author'> & {
  author: AuthorType;
};
export type ProductAdditionalInfo = z.infer<typeof ProductAdditionalInfo>;
export type ReviewType = z.infer<typeof Review>;
export type NewReviewType = z.infer<typeof NewReview>;
export type AuthorType = WithId<z.infer<typeof Author>>;
export type ProductWithId = WithId<ProductType>;
export type ReviewWithId = WithId<ReviewType>;
export type AuthorWithId = WithId<AuthorType>;
export type ProductsWithTotal = {
  total: number;
  products: ProductWithId[];
};
export type ParamsWithId = z.infer<typeof ProductIdParams>;
export type ParamsWithIdAndReview = z.infer<typeof ReviewIdParams>;

export const ProductsModel = db.collection<ProductType>('products');
