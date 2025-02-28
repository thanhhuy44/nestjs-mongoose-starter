import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user: {
        id: string;
        role: string;
      };
    }
  }
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: () => void) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const verifiedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = verifiedToken as jwt.JwtPayload as any;
      next();
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException(error.message);
    }
  }
}
