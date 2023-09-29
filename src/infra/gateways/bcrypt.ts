import { compareSync, hashSync } from 'bcrypt';

export class BcryptGateway {
  static validate(input: { password: string, pwdEnccrypted: string }): boolean  {
    return compareSync(input.password, input.pwdEnccrypted);
  }

  static hash(password: string): string {
    return hashSync(password, 10);
  }
}
