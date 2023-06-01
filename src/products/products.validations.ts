import mongoose from 'mongoose';
import { z } from 'zod';
import { SORTING_VALUES } from '../constants';
import { SortingValues } from '../types';
import { transformToInteger } from '../utils/transformToInteger';

export const ProductIdParams = z.object({
  id: z
    .string({ required_error: 'Params are required' })
    .nonempty({ message: "Params can't be empty" })
    .refine(
      (arg) => {
        try {
          return new mongoose.Types.ObjectId(arg);
        } catch (error) {
          return false;
        }
      },
      { message: 'Invalid id' }
    ),
});

export const ReviewIdParams = ProductIdParams.extend({
  reviewId: z
    .string({ required_error: 'Params are required' })
    .nonempty({ message: "Params can't be empty" })
    .refine(
      (arg) => {
        try {
          return new mongoose.Types.ObjectId(arg);
        } catch (e) {
          return false;
        }
      },
      { message: 'Invalid id' }
    ),
});

export const ProductQueryParams = z
  .object({
    query: z.string().default(''),
    limit: z
      .string()
      .transform((arg) => transformToInteger(arg, '0'))
      .default('0'),
    page: z
      .string()
      .transform((arg) => transformToInteger(arg, '1'))
      .default('1'),
    sort: z
      .string()
      .toUpperCase()
      .transform((arg) => {
        if (SORTING_VALUES.includes(arg as SortingValues)) {
          return arg;
        }
        return 'PRICE_ASC';
      })
      .default('PRICE_ASC'),
  })
  .strict();

export const NewReview = z.object({
  rating: z
    .number({ required_error: 'Rating is required' })
    .min(1, { message: 'Rating must be greater than 0' })
    .max(5, { message: "Rating can't be greater than 5" }),
  text: z
    .string({ required_error: 'Text is required' })
    .nonempty({ message: "Review text can't be empty" }),
});

export const NewProduct = z
  .object({
    available: z.boolean().default(true),
    isPublished: z.boolean().default(true),
    name: z
      .string({ required_error: 'Name is required' })
      .trim()
      .nonempty({ message: "Product name can't be empty" }),
    discount: z
      .number()
      .nonnegative({ message: "Discount can't be less than 0 %" })
      .max(99, { message: "Discount can't be greater than 99 %" })
      .default(0),
    price: z
      .number({ required_error: 'Price is required' })
      .positive({ message: 'Price must be greater than 0' }),
    stock: z
      .number({ required_error: 'Stock is required' })
      .nonnegative({ message: 'Stock must be greater than 0' }),
    pictures: z.string().url({ message: 'Picture must be a valid URL' }),
    tags: z.array(z.string()).default([]),
    description: z
      .string({ required_error: 'Description is required' })
      .trim()
      .nonempty({ message: 'Description must be provided' }),
    wight: z
      .string({ required_error: 'Weight is required' })
      .trim()
      .nonempty({ message: 'Weight must be provided' }),
  })
  .strict();

export const ProductUpdate = NewProduct.partial();


