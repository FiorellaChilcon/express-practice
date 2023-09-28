export enum TokenType {
  BEARER = 'bearer',
  REFRESH = 'refresh',
}

export interface TokenModel {
  token: string;
  expiresIn: number;
  expiresAt: Date;
  createdAt: number;
  type: TokenType
}
