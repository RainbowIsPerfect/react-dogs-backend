import { errorHandler } from './middlewares/errorHander';
import { client } from './db';
import express from 'express';
import cors from 'cors';
import { config } from './config/index';
import { userRouter } from './users/user.routes';
import { productsRouter } from './products/product.routes';

export const app = express();

export const connectToDb = async () => {
  try {
    await client.connect();
    console.log('Connected to DB');
    startServer();
  } catch (error) {
    console.log('Failed to connect');
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
    console.log(`Server is running on port: ${config.server.port}`)
  );
};
