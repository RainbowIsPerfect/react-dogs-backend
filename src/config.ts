import dotenv from 'dotenv';

dotenv.config();

const MONGO_USERNAME = process.env.MONGO_USERNAME || '';
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || '';
const MONGO_CLUSTER = process.env.MONGO_CLUSTER || '';
const MONGO_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_CLUSTER}.mongodb.net/`;
const PRIVATE_KEY = process.env.PRIVATE_KEY || '';

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;

export const config = {
  mongo: {
    url: MONGO_URL
  },
  server: {
    port: PORT
  },
  token: {
    key: PRIVATE_KEY
  }
}
