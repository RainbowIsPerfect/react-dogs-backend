import { logger } from './Logger';
import { UserModel } from './../users/user.model';
import { ProductsModel } from '../products/product.model';

export const clearCollections = async () => {
  try {
    const {deletedCount: productsDeleteCount} = await ProductsModel.deleteMany({});
    logger.success(`Deleted ${productsDeleteCount} from Products collection`);    
    const {deletedCount: usersDeleteCount} = await UserModel.deleteMany({});
    logger.success(`Deleted ${usersDeleteCount} from Users collection`);    
  } catch (error) {
    logger.error('Failed to clear collections');
  }
};
