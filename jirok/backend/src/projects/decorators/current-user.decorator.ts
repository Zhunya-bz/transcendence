import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
	(_data: unknown, ctx: ExecutionContext): number => {
		const request = ctx.switchToHttp().getRequest();
		return Number(request.headers['x-user-id']);
	},
);