import { NextFunction, Request, Response } from 'express';
import {
  NewProduct,
  ParamsWithId,
  ParamsWithIdAndReview,
  ProductsWithTotal,
  ProductType,
  NewReviewType,
  ProductsQueryParams,
} from './../types';
import { getQueryParams } from './../utils/getQueryParams';
import { AppError } from '../utils/AppError';
import { LocalsType } from '../types';
import { ProductsModel } from './product.model';
import { logger } from '../utils/Logger';
import { countAvgRating } from '../utils/countAvgRating';

const createProduct = async (
  req: Request<{}, ProductType, NewProduct>,
  res: Response<ProductType, LocalsType>,
  next: NextFunction
) => {
  try {
    logger.processing('Creating new product..');

    const newProduct: ProductType = {
      ...req.body,
      author: res.locals.user,
      reviews: [],
      likes: [],
      avgRating: 0,
    };
    const product = await ProductsModel.create(newProduct);

    if (!product) {
      throw new AppError('Failed to add new product');
    }

    logger.success('New product created');

    return res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

const readAllProducts = async (
  req: Request<{}, ProductsWithTotal, {}, ProductsQueryParams>,
  res: Response<ProductsWithTotal>,
  next: NextFunction
) => {
  try {
    logger.processing(
      `Searching for products with query params: ${JSON.stringify(req.query)}...`
    );

    const { limit, query, skip, sort } = getQueryParams(req.query);
    const products = await ProductsModel.find({
      name: { $regex: query, $options: 'i' },
    });
    const productsWithParamsApplied = await ProductsModel.find({
      name: { $regex: query, $options: 'i' },
    })
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const productWithTotal = {
      total: products.length,
      products: productsWithParamsApplied,
    };

    logger.success(`${products.length} products found`);

    return res.json(productWithTotal);
  } catch (error) {
    next(error);
  }
};

const getProductById = async (
  req: Request<ParamsWithId, ProductType>,
  res: Response<ProductType>,
  next: NextFunction
) => {
  try {
    const productId = req.params.id;
    logger.processing(`Searching for product with ${productId} ID...`);
    const product = await ProductsModel.findOne({
      _id: productId,
    });

    if (!product) {
      throw new AppError(`Product with ${productId} not found`);
    }

    logger.success(`Product with ${productId} ID found`);

    return res.json(product);
  } catch (error) {
    next(error);
  }
};

const setLikeById = async (
  req: Request<ParamsWithId, ProductType>,
  res: Response<ProductType, LocalsType>,
  next: NextFunction
) => {
  try {
    const productId = req.params.id;
    logger.processing(`Setting like on product with ${productId} ID...`);
    const product = await ProductsModel.findOneAndUpdate(
      { _id: productId },
      { $addToSet: { likes: res.locals.user._id } },
      { returnDocument: 'after' }
    );

    if (!product) {
      throw new AppError('Failed to set like');
    }

    logger.success(`Like was successfully set`);

    return res.json(product);
  } catch (error) {
    next(error);
  }
};

const deleteLikeById = async (
  req: Request<ParamsWithId, ProductType>,
  res: Response<ProductType, LocalsType>,
  next: NextFunction
) => {
  try {
    const productId = req.params.id;
    logger.processing(`Removing like from product with ${productId} ID...`);
    const product = await ProductsModel.findOneAndUpdate(
      { _id: productId },
      { $pull: { likes: res.locals.user._id } },
      { returnDocument: 'after' }
    );

    if (!product) {
      throw new AppError(`Product with ${productId} not found`);
    }

    logger.success(`Like was successfully removed`);

    return res.json(product);
  } catch (error) {
    next(error);
  }
};

const deleteProductById = async (
  req: Request<ParamsWithId, ProductType>,
  res: Response<ProductType, LocalsType>,
  next: NextFunction
) => {
  try {
    const productId = req.params.id;
    logger.processing(`Removing product with ${productId} ID...`);
    const product = await ProductsModel.findOne({
      _id: productId,
    });

    if (!product) {
      throw new AppError(`Product with ID ${productId} not found`);
    }

    if (!(product.author._id.toString() === res.locals.user._id.toString())) {
      throw new AppError(`You can't delete other users products`, 403);
    }

    const deletedProduct = await product.deleteOne({
      returnDocument: 'before',
    });

    if (!deletedProduct) {
      throw new AppError('Failed to delete product', 400);
    }

    logger.success(`Product was successfully removed`);

    return res.json(deletedProduct);
  } catch (error) {
    next(error);
  }
};

const updateProductById = async (
  req: Request<ParamsWithId, ProductType, NewProduct>,
  res: Response<ProductType, LocalsType>,
  next: NextFunction
) => {
  try {
    const productId = req.params.id;
    logger.processing(`Updating product with ${productId} ID...`);
    const product = await ProductsModel.findOne({
      _id: productId,
    });

    if (!product) {
      throw new AppError(`Product with ID ${productId} not found`);
    }
    console.log(product.author._id.toString() === res.locals.user._id.toString());
    
    if (!(product.author._id.toString() === res.locals.user._id.toString())) {
      throw new AppError(`You can't update other users products`, 403);
    }

    const updatedProduct = await ProductsModel.findOneAndUpdate(
      { _id: productId },
      { $set: { ...req.body } },
      { returnDocument: 'after' }
    );

    if (!updatedProduct) {
      throw new AppError('Failed to update product', 400);
    }

    logger.success(`Product with ${productId} ID was updated`);

    return res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

const addReviewById = async (
  req: Request<ParamsWithId, ProductType, NewReviewType>,
  res: Response<ProductType, LocalsType>,
  next: NextFunction
) => {
  try {
    const productId = req.params.id;
    logger.processing(`Adding review on product with ${productId} ID...`);

    const product = await ProductsModel.findOneAndUpdate(
      { _id: productId },
      {
        $push: {
          reviews: {
            author: res.locals.user,
            product: productId,
            ...req.body,
          },
        },
      },
      { returnDocument: 'after' }
    );

    if (!product) {
      throw new AppError('Product not found');
    }

    const avgRating = countAvgRating(product.reviews);
    const updatedProduct = await ProductsModel.findOneAndUpdate(
      { _id: productId },
      {
        $set: { avgRating },
      },
      {
        returnDocument: 'after',
      }
    );

    if (!updatedProduct) {
      throw new AppError('Product or review not found');
    }

    logger.success(`Review was added product with ${productId} ID...`);

    return res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

const removeReviewById = async (
  req: Request<ParamsWithIdAndReview, ProductType>,
  res: Response<ProductType, LocalsType>,
  next: NextFunction
) => {
  try {
    const { id, reviewId } = req.params;
    logger.processing(`Removing review from product with ${id} ID...`);
    const product = await ProductsModel.findOneAndUpdate(
      { _id: id },
      { $pull: { reviews: { _id: reviewId } } },
      { returnDocument: 'after' }
    );

    if (!product) {
      throw new AppError('Product or review not found');
    }

    const avgRating = countAvgRating(product.reviews);
    const updatedProduct = await ProductsModel.findOneAndUpdate(
      { _id: id },
      {
        $set: { avgRating },
      },
      {
        returnDocument: 'after',
      }
    );

    if (!updatedProduct) {
      throw new AppError('Product or review not found');
    }

    logger.success(`Review was removed from product with ${id} ID...`);

    return res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

export const productsController = {
  readAllProducts,
  createProduct,
  getProductById,
  deleteProductById,
  deleteLikeById,
  setLikeById,
  updateProductById,
  addReviewById,
  removeReviewById,
};
