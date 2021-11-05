import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { CONFIG } from '@/config';
import { hashString } from '@/common/utils';
import { SessionEntity } from '@/modules/users/entities/session.entity';

@Injectable()
export class AuthService {
  constructor(private readonly em: EntityManager) {}

  getNewExpirationDate() {
    return new Date(Date.now() + CONFIG.APP.SESSION_DURATION_MILLIS);
  }

  getNewResetPasswordExpiration() {
    return new Date(Date.now() + 1000 * 60 * 60 * 24); // expires after 24h
  }

  getTokenFromHeader(req: Request): undefined | string {
    const { authorization } = req.headers;

    if (!authorization || !authorization.match(/^Bearer [a-zA-Z0-9_-]{24}$/)) {
      return;
    }

    return authorization.replace('Bearer ', '');
  }

  getTokenFromCookie(req: Request): undefined | string {
    const { cookie } = req.headers;

    if (!cookie) {
      return;
    }

    const parts = cookie.split(/; */);
    const tokenPart = parts.find((part) => part.startsWith('token='));

    if (!tokenPart) {
      return;
    }

    const token = tokenPart.replace('token=', '').split(' ')[0];

    if (!token.match(/^[a-zA-Z0-9_-]{24}$/)) {
      return;
    }

    return token;
  }

  async getSessionByToken(token?: string): Promise<undefined | SessionEntity> {
    if (!token) {
      return;
    }

    const hashedToken = hashString(token);

    const session = await this.em.findOne(
      SessionEntity,
      { token: hashedToken, expiresAt: { $gt: new Date() } },
      ['user'],
    );

    if (!session) {
      return;
    }

    // refresh session whenever it lasts for 10% of SESSION_DURATION to reduce number of db calls
    const sessionRefreshThreshold = CONFIG.APP.SESSION_DURATION_MILLIS / 10;
    const lastSessionRefresh =
      session.expiresAt.getTime() - CONFIG.APP.SESSION_DURATION_MILLIS;

    if (lastSessionRefresh + sessionRefreshThreshold < Date.now()) {
      session.expiresAt = this.getNewExpirationDate();

      await this.em.flush();
    }

    return session;
  }

  async getSessionFromHeader(req: Request): Promise<undefined | SessionEntity> {
    return await this.getSessionByToken(this.getTokenFromHeader(req));
  }

  async getSessionFromCookie(req: Request): Promise<undefined | SessionEntity> {
    return await this.getSessionByToken(this.getTokenFromCookie(req));
  }
}
