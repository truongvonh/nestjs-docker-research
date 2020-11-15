import { createMethodDecorator } from '@nestjs/swagger/dist/decorators/helpers';

export const UseMiddleware = middleware => {
  console.log('middleware', middleware);
  return createMethodDecorator('UseMiddleware', middleware);
};
