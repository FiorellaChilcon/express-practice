import { TokenGateway } from '@/infra/gateways';
import { Request, Response, NextFunction } from 'express';
import { env } from '@/main/config';
import { JsonWebTokenError } from 'jsonwebtoken';
import { UnauthorizedError } from '@/domain/errors/unauthorized';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token: string = req.headers['authorization'] || '';
    const tokenGateway = new TokenGateway(env.jwt.secretKey, env.jwt.expiresIn);

    try {
      const [, userToken] = token.split(' ');
      if (/bearer/i.test(token) && userToken) {
        tokenGateway.verifyToken(userToken);
        next();
      } else {
        throw new UnauthorizedError();
      }
    } catch (err) {
      throw err instanceof JsonWebTokenError ? new UnauthorizedError({ message: err.message }) :  err;
    }
  } catch (e) {
    next(e);
  }
};
