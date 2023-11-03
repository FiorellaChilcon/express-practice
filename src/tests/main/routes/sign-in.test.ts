import { server } from '@/main/config';
import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import request from 'supertest';
import { UserRepository } from '@/infra/repos';
import { User } from '@/infra/entity';
import { BcryptGateway } from '@/infra/gateways';

const mockUserPwd = 'Test123.';
const mockUser = {
  id: '123',
  firstName: 'Fiorella',
  lastName: 'Test',
  username: 'appUser',
  password: BcryptGateway.hash(mockUserPwd),
  email: 'fiorella@yopmail.com'
} as User;

jest.mock<UserRepository>('@/infra/repos/user');
const userRepositoryMock = jest.mocked(UserRepository);
userRepositoryMock.prototype.findOneByEmailOrUsername.mockReturnValue(Promise.resolve(mockUser));

const app = request(server);

describe('Route | /sign-in', () => {
  describe('POST', () => {
    describe('When credentials are valid', () => {
      let response: any;
      beforeEach(async() => {
        response = await app.post('/sign-in').send({ user: mockUser.username, password: mockUserPwd });
      });

      it('retrieves user from the database', async () => {
  
        expect(UserRepository.prototype.findOneByEmailOrUsername).toHaveBeenCalledTimes(1);
        expect(response.body.data.user).toBeDefined();
      });

      it('returns a token', async () => {
        expect(response.body.data.token).toBeDefined();
      });
    });

    describe('When credentials are invalid', () => {
      let response: any;
      beforeEach(async() => {
        response = await app.post('/sign-in').send({ user: mockUser.username, password: 'wrongPassword' });
      });

      it('throws an unauthorized error', async () => {
        expect(response.statusCode).toBe(403);
        expect(response.body.message).toBeDefined();
      });
    });

    describe('When user doesn`t exists', () => {
      let response: any;
      beforeEach(async() => {
        userRepositoryMock.prototype.findOneByEmailOrUsername.mockReturnValueOnce(Promise.resolve(null));
        response = await app.post('/sign-in').send({ user: mockUser.username, password: 'wrongPassword' });
      });

      it('throws a not-found error', async () => {
        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBeDefined();
      });
    });

    describe('When user input is invalid', () => {
      let response: any;
      beforeEach(async() => {
        response = await app.post('/sign-in').send({ user: mockUser.username });
      });

      it('throws a bad-request error', async () => {
        expect(response.statusCode).toBe(400);
        expect(response.body.errors).toBeDefined();
      });
    });
  });
});
