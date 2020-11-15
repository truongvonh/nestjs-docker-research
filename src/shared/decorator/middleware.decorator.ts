import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    // const next() = ctx.switchToHttp().getNext();
    // const user = request.user;
    //
    // return data ? user && user[data] : user;
  },
);
