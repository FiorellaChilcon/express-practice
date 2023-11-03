import { server } from '@/main/config';
import { describe, expect, it } from '@jest/globals';
import request from 'supertest';

const app = request(server);

describe('Route | /', () => {
  it('returns a json response', async () => {
    const response = await app.get('/');
    expect(response.body.title).toEqual('Learning Express');
  });
});
