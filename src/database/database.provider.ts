import { Logger } from '@nestjs/common';
import { MongoClient } from 'mongodb';
import { COMMON_NAME_SPACE } from '../constants/common';

export const isProduction = process.env.NODE_ENV === 'production';

const MONGO_NAME_BY_ENV = isProduction ? 'trello-nest-stack_database' : 'mongo';

export const uri = isProduction
  ? `mongodb://${MONGO_NAME_BY_ENV}:27017`
  : `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${MONGO_NAME_BY_ENV}:27017`;

export const DatabaseProvider = [
  {
    provide: COMMON_NAME_SPACE.DATABASE_CONNECTION,
    useFactory: async (): Promise<MongoClient> => {
      try {
        Logger.log('Database connect successful!');
        return new MongoClient(uri, { useNewUrlParser: true });
      } catch (e) {
        Logger.error('Database failed connect!');
      }
    },
  },
];
