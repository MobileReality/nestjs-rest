import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@/common/guards/auth.guard';
import { USERS_ERROR } from '@/modules/users/users.constant';

export const UserType = {
  ADMIN: true,
  STANDARD: false,
};

export const Auth = (isAdmin?: boolean) => {
  const decorators = [
    UseGuards(AuthGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({
      description: USERS_ERROR.NO_VALID_TOKEN.message,
    }),
  ];

  if (isAdmin !== undefined) {
    decorators.unshift(SetMetadata('isAdmin', isAdmin));
    decorators.push(
      ApiForbiddenResponse({
        description: `Auth user isAdmin parameter is not equal to "${isAdmin}".`,
      }),
    );
  }

  return applyDecorators(...decorators);
};