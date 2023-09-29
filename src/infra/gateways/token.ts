import { UserModel, TokenType } from '@/domain/contracts/models';
import { Token } from '@/domain/models';
import { env } from '@/main/config';
import jwt from 'jsonwebtoken';

export class TokenGateway {
  constructor(private jwtSecret: string, private expiresIn: number) {}

  createToken(user: UserModel, type: TokenType): Token {
    const expiresIn = env.jwt.expiresIn;
    const createdAt = Date.now();
    const expiresAt = new Date(createdAt + this.expiresIn * 1000);
    const token = jwt.sign({
      data: { user }
    }, this.jwtSecret, { expiresIn });

    return new Token({
      token,
      expiresIn,
      expiresAt,
      createdAt,
      type
    });
  }

  verifyToken(token: string) {
    const result = jwt.verify(token, this.jwtSecret);
    return result;
  }
}
