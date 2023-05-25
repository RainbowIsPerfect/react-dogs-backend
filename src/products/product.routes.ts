import {
  NewProduct,
  ProductIdParams,
  ProductUpdate,
  NewReview,
  ReviewIdParams,
} from './product.model';
import { validateRequest } from '../middlewares/validateRequest';
import { Router } from 'express';
import { authRequired } from '../middlewares/authRequired';
import { productsController } from './product.contollers';

export const productsRouter = Router();

productsRouter.post(
  '/products',
  authRequired,
  validateRequest({
    body: NewProduct,
  }),
  productsController.createProduct
);
productsRouter.get('/products?', productsController.readAllProducts);
productsRouter.get(
  '/products/:id',
  authRequired,
  validateRequest({
    params: ProductIdParams,
  }),
  productsController.getProductById
);
productsRouter.put(
  '/products/likes/:id',
  authRequired,
  validateRequest({
    params: ProductIdParams,
  }),
  productsController.setLikeById
);
productsRouter.delete(
  '/products/likes/:id',
  authRequired,
  validateRequest({
    params: ProductIdParams,
  }),
  productsController.deleteLikeById
);
productsRouter.delete(
  '/products/:id',
  authRequired,
  validateRequest({
    params: ProductIdParams,
  }),
  productsController.deleteProductById
);
productsRouter.patch(
  '/products/:id',
  authRequired,
  validateRequest({
    params: ProductIdParams,
    body: ProductUpdate,
  }),
  productsController.updateProductById
);
productsRouter.post(
  '/products/review/:id',
  authRequired,
  validateRequest({
    params: ProductIdParams,
    body: NewReview,
  }),
  productsController.addReviewById
);
productsRouter.delete(
  '/products/review/:id/:reviewId',
  authRequired,
  validateRequest({
    params: ReviewIdParams,
  }),
  productsController.removeReviewById
);
