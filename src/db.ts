import { config } from './config/index';
import { MongoClient } from 'mongodb';

export const client = new MongoClient(config.mongo.url, { retryWrites: true, w: 'majority' });
export const db = client.db();
