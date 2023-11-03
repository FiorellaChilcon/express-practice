import bcrypt from 'bcrypt';

export class BcryptGateway {
  static validate(input: { password: string, pwdEnccrypted: string }): boolean  {
    return bcrypt.compareSync(input.password, input.pwdEnccrypted);
  }

  static hash(password: string): string {
    return bcrypt.hashSync(password, 10);
  }
}
