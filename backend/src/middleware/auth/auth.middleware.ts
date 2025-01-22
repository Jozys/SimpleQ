import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { Request } from 'express';
import { AuthService } from '../../auth/auth.service';
import allowedRequests from './allowed';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private authService: AuthService) {}

  async use(req: Request, res: any, next: () => void) {
    let result: AxiosResponse<any> | null = null;
    try {
      result = await axios.get(
        `${process.env.KC_URL}/realms/${process.env.KC_REALM}/protocol/openid-connect/userinfo`,
        {
          headers: {
            Authorization: `${req.headers.authorization}`,
          },
        },
      );
      //@ts-ignore
      req.userId = result.data.sub;
      if (result?.status != 200) {
        throw new UnauthorizedException('You are not logged in');
      } else {
        this.authService.checkUser(
          result.data.sub,
          result.data.preferred_username,
          result.data.email,
        );
      }
    } catch (e) {
      //console.log(e);
      // Check wether the current path is excluded from the authentication check
      if (allowedRequests.some((a) => new RegExp(a).test(req.baseUrl))) {
        next();
        return;
      }
      throw new UnauthorizedException('You are not logged in!');
    }
    if (result || allowedRequests.some((a) => req.baseUrl.includes(a))) {
      next();
    } else {
      throw new UnauthorizedException('You are not logged in');
    }
  }
}
