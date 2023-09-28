import { TokenType, TokenModel } from '@/domain/contracts/models';

export class Token {
  public readonly token: string;
  public readonly expiresIn: number;
  public readonly expiresAt: Date;
  public readonly createdAt: number;
  public readonly type: TokenType;

  constructor(data: TokenModel) {
    this.token = data.token;
    this.expiresIn = data.expiresIn;
    this.expiresAt = data.expiresAt;
    this.createdAt = data.createdAt;
    this.type = data.type;
  }
}
