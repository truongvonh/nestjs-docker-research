import { CAT_MODEL } from './constants';
import { Connection } from 'mongoose';
import { CatSchema } from './cat.schema';
import { COMMON_NAME_SPACE } from '../constants/common';

export const CatProvider = [
  {
    provide: CAT_MODEL,
    useFactory: (connection: Connection) => connection.model('Cat', CatSchema),
    inject: [COMMON_NAME_SPACE.DATABASE_CONNECTION],
  },
];
