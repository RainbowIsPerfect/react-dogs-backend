import { ObjectId } from 'mongodb';
import { Locals, NextFunction, Request, Response } from 'express';
import { UserWithId } from '../users/user.model';
import {
  ProductsModel,
  ProductsWithTotal,
  ProductWithId,
  ProductType,
  NewProductType,
  ParamsWithId,
  ProductAdditionalInfo,
  NewReviewType,
  ParamsWithIdAndReview,
} from './product.model';

export type LocalsType = { user: UserWithId };
export type RequestQuery = {
  query: string;
  limit: number;
  page: number;
};

const createProduct = async (
  req: Request<{}, ProductWithId, NewProductType>,
  res: Response<ProductWithId, LocalsType>,
  next: NextFunction
) => {
  try {
    const newProduct: ProductType = {
      author: {
        ...res.locals.user,
      },
      reviews: [],
      likes: [],
      ...req.body,
    };

    const { insertedId } = await ProductsModel.insertOne(newProduct);
    const product = await ProductsModel.findOne(insertedId);

    if (!product) {
      throw new Error('Failed to add new product');
    }

    return res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

const readAllProducts = async (
  req: Request<{}, ProductsWithTotal, {}, RequestQuery>,
  res: Response<ProductsWithTotal>,
  next: NextFunction
) => {
  try {
    const productsLength = (await ProductsModel.find().toArray()).length;
    const products = await ProductsModel.find(
      {
        name: { $regex: req.query.query || '', $options: 'i' },
      },
      { skip: (req.query.page - 1) * +req.query.limit, limit: +req.query.limit }
    ).toArray();

    const productWithTotal = {
      total: req.query.query ? products.length : productsLength,
      products,
    };

    return res.status(200).json(productWithTotal);
  } catch (error) {
    next(error);
  }
};

const getProductById = async (
  req: Request<ParamsWithId, ProductWithId>,
  res: Response<ProductWithId>,
  next: NextFunction
) => {
  try {
    const productId = req.params.id;
    const product = await ProductsModel.findOne({
      _id: new ObjectId(productId),
    });

    if (!product) {
      res.status(404);
      throw new Error(`Product with ${productId} not found`);
    }

    return res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

const setLikeById = async (
  req: Request<ParamsWithId, ProductWithId>,
  res: Response<ProductWithId, LocalsType>,
  next: NextFunction
) => {
  try {
    const productId = req.params.id;
    const product = await ProductsModel.findOneAndUpdate(
      { _id: new ObjectId(productId) },
      { $addToSet: { likes: res.locals.user._id.toString() } },
      { returnDocument: 'after' }
    );

    if (!product.value) {
      res.status(404);
      throw new Error('Failed to set like');
    }

    return res.status(200).json(product.value);
  } catch (error) {
    next(error);
  }
};

const deleteLikeById = async (
  req: Request<ParamsWithId, ProductWithId>,
  res: Response<ProductWithId, LocalsType>,
  next: NextFunction
) => {
  try {
    const productId = req.params.id;
    const product = await ProductsModel.findOneAndUpdate(
      { _id: new ObjectId(productId) },
      { $pull: { likes: res.locals.user._id.toString() } },
      { returnDocument: 'after' }
    );

    if (!product.value) {
      res.status(404);
      throw new Error('Failed to delete like');
    }

    return res.status(200).json(product.value);
  } catch (error) {
    next(error);
  }
};

const deleteProductById = async (
  req: Request<ParamsWithId, ProductWithId>,
  res: Response<ProductWithId, LocalsType>,
  next: NextFunction
) => {
  try {
    const productId = req.params.id;
    const product = await ProductsModel.findOne({
      _id: new ObjectId(productId),
    });

    if (!product) {
      res.status(404);
      throw new Error(`Product with ID ${productId} not found`);
    }

    if (!(product.author._id.toString() === res.locals.user._id.toString())) {
      res.status(403);
      throw new Error(`Can't delete other users products`);
    }

    const deletedProduct = await ProductsModel.findOneAndDelete({
      _id: new ObjectId(productId),
    });

    if (!deletedProduct.value) {
      res.status(404);
      throw new Error('Failed to delete product');
    }

    return res.status(200).json(deletedProduct.value);
  } catch (error) {
    next(error);
  }
};

const updateProductById = async (
  req: Request<ParamsWithId, ProductWithId, NewProductType>,
  res: Response<ProductWithId, LocalsType>,
  next: NextFunction
) => {
  try {
    const productId = req.params.id;
    const product = await ProductsModel.findOne({
      _id: new ObjectId(productId),
    });

    if (!product) {
      res.status(404);
      throw new Error(`Product with ID ${productId} not found`);
    }

    if (!(product.author._id.toString() === res.locals.user._id.toString())) {
      res.status(403);
      throw new Error(`Can't delete other users products`);
    }

    const updatedProduct = await ProductsModel.findOneAndUpdate(
      {
        _id: new ObjectId(productId),
      },
      { $set: req.body },
      { returnDocument: 'after' }
    );

    if (!updatedProduct.value) {
      res.status(404);
      throw new Error('Failed to update product');
    }

    return res.status(200).json(updatedProduct.value);
  } catch (error) {
    next(error);
  }
};

const addReviewById = async (
  req: Request<ParamsWithId, ProductWithId, NewReviewType>,
  res: Response<ProductWithId, LocalsType>,
  next: NextFunction
) => {
  try {
    const productId = req.params.id;
    const product = await ProductsModel.findOneAndUpdate(
      { _id: new ObjectId(productId) },
      {
        $push: {
          reviews: {
            author: res.locals.user,
            product: new ObjectId(productId).toString(),
            ...req.body,
            _id: new ObjectId().toString(),
          },
        },
      },
      { returnDocument: 'after' }
    );

    if (!product.value) {
      res.status(404);
      throw new Error('Product not found');
    }

    return res.status(200).json(product.value);
  } catch (error) {
    next(error);
  }
};

const removeReviewById = async (
  req: Request<ParamsWithIdAndReview, ProductWithId>,
  res: Response<ProductWithId, LocalsType>,
  next: NextFunction
) => {
  try {
    const { id, reviewId } = req.params;

    const product = await ProductsModel.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $pull: { reviews: { _id: reviewId } } },
      { returnDocument: 'after' }
    );

    if (!product.value) {
      res.status(404);
      throw new Error('Product or review not found');
    }

    return res.status(200).json(product.value);
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
