import { ConflictException, NotFoundException } from '@nestjs/common';

export enum UserType {
  ADMIN = 'ADMIN',
  STANDARD = 'STANDARD',
}

export const USERS_TAG = 'Users';

export const USERS_ERROR = {
  ID_NOT_FOUND: new NotFoundException(
    'User with provided id was not found',
    'USER_ID_NOT_FOUND',
  ),
  EMAIL_NOT_FOUND: new NotFoundException(
    'User with provided email was not found',
    'USER_EMAIL_NOT_FOUND',
  ),
  INVALID_PASSWORD: new NotFoundException(
    'Provided password is not valid',
    'USER_INVALID_PASSWORD',
  ),
  RESET_PASSWORD_TOKEN_EXPIRED: new NotFoundException(
    'Provided reset password token has expired',
    'USER_RESET_PASSWORD_TOKEN_EXPIRED',
  ),
  EMAIL_EXISTS: new ConflictException(
    'User with provided email already exists',
    'USER_EMAIL_EXISTS',
  ),
  ALREADY_ONBOARDED: new ConflictException(
    'You are already onboarded',
    'USER_ALREADY_ONBOARDED',
  ),
};

export const USER_VALIDATION = {
  EMAIL: {
    MAX_LENGTH: 254,
  },
  PASSWORD: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 64,
  },
  FULL_NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 100,
  },
};
