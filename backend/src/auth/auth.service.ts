import {
  ForbiddenException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from '../database/user/user.service';
import { User } from '@prisma/client';
import { generateUsername } from 'unique-username-generator';
import { USERNAME_LENGTH } from '../../config';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  /**
   * This method uses an ory session to create a possible user with their ory id inside our database
   * @param session an ory session object
   * */
  async checkUser(id: string, username: string, email: string) {
    const possibleUser: User | null = await this.userService.getUser(
      id as string,
    );
    if (!possibleUser) {
      await this.userService.createUser(
        username as string,
        false,
        false,
        new Date(),
        0,
        email as string,
        id as string,
      );
    }
  }

  /**
   * This request is only for development purposes
   * It offers the client the possiblity to login to ory and get the cookie needed to send requests to this backend
   * Makes it easier to test the features, as the client dont have to copy the cookie from the frontend.
   * @param req the request possibly containing the ory session cookie
   * @param res the response object, that either sends the correct cookie, or redirects to the ory login page
   */
  async getCookie(req: Request, res: Response) {
    if (process.env.NODE_ENV == 'dev') {
      try {
        const result = await global.ory.toSession({
          cookie: req.headers.cookie,
        });
        if (result) {
          return res.json({ cookie: result.config.headers.Cookie });
        }
      } catch (e) {
        if (
          e?.response?.data?.error?.code == 401 ||
          e?.response.data.statusCode == 401
        ) {
          return res.redirect(
            `${process.env.ORY_URL}/ui/login?return_to=${encodeURI(`${process.env.APP_URL}/cookie`)}`,
          );
        }

        throw new ServiceUnavailableException(
          'The ory backend or tunnel is currently not available',
        );
      }
    } else {
      throw new ForbiddenException(
        'This request is only allowed for development purposes.',
      );
    }
  }

  /**
   * Generates an username, repeated aslong as the generated username already exists
   * @returns username a random string of up to 20 characters
   * @private this method is only used in the auth service
   */
  private async generateUsername(): Promise<string> {
    let username = generateUsername('', 0, USERNAME_LENGTH);
    while (await this.userService.checkUsernameExists(username)) {
      username = generateUsername('', 0, USERNAME_LENGTH);
    }
    return username;
  }
}
