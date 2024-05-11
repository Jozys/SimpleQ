
import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req: any, res: any, next: () => void) {
    let result = 0;
    try {
      result = await global.ory.toSession({
        cookie: req.header('cookie'),
      });
    } catch (e) {
      throw new UnauthorizedException('You are not logged in!');
    }
    if (result) {
      next();
    } else {
      throw new UnauthorizedException('You are not logged in');
    }
  }
}
