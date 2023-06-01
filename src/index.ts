import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { logger } from './utils/Logger';
import { errorHandler } from './middlewares/errorHander';
import { config } from './config';
import { userRouter } from './users/user.routes';
import { productsRouter } from './products/product.routes';
import { clearCollections } from './utils/clearCollections';

export const app = express();

export const connectToDb = async () => {
  try {
    logger.processing('Connecting to DB...');
    await mongoose.connect(config.mongo.url, {
      retryWrites: true,
      w: 'majority',
    });
    logger.success('Connected to DB');
    startServer();
  } catch (error) {
    logger.error('Failed to connect to DB');
  }
};

connectToDb();

export const startServer = () => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());

  app.use(productsRouter);
  app.use(userRouter);

  app.get('/ping', (req, res) =>
    res.status(200).json({ message: 'Server is OK' })
  );

  app.use((req, res) =>
    res.status(404).json({ message: 'Route is not found' })
  );
  app.use(errorHandler);

  app.listen(config.server.port, () =>
    logger.success(`Server is running on port: ${config.server.port}`)
  );
};
