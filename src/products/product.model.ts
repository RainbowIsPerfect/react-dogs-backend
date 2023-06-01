import { userSchema } from './../users/user.model';
import { ProductType, ReviewType } from './../types';
import { Schema, model } from 'mongoose';

const authorSchema = userSchema.pick([
  'about',
  'name',
  'email',
  'avatar',
  'group',
]);

const reviewSchema = new Schema<ReviewType>(
  {
    rating: { type: Number, required: true },
    text: { type: String, required: true },
    product: { type: String, required: true },
    author: { type: authorSchema, required: true },
  },
  {
    timestamps: true,
  }
);

const productsSchema = new Schema<ProductType>(
  {
    discount: { type: Number, required: true },
    stock: { type: Number, required: true },
    available: { type: Boolean, required: true },
    isPublished: { type: Boolean, required: true },
    pictures: { type: String, required: true },
    tags: { type: [String], required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    wight: { type: String, required: true },
    description: { type: String, required: true },
    likes: { type: [String], required: true },
    reviews: { type: [reviewSchema], required: true },
    author: { type: authorSchema, required: true },
    avgRating: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

export const ProductsModel = model<ProductType>(
  'products',
  productsSchema
);
