import request from 'supertest';
import server from '../src/server';
import { reset } from '../src/service';

describe('Test the root path', () => {

  beforeAll(() => {
    reset();
  });

  beforeAll(() => {
    server.close();
  });

  /***************************************************************
                       Auth Tests
  ***************************************************************/

  test('Registration of initial user', async () => {
    const response = await request(server).post('/admin/auth/register').send({
      email: 'hayden.smith@unsw.edu.au',
      password: 'bananapie',
      name: 'Hayden',
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.token instanceof String);
  });

  test('Inability to re-register a user', async () => {
    const response = await request(server).post('/admin/auth/register').send({
      email: 'hayden.smith@unsw.edu.au',
      password: 'bananapie',
      name: 'Hayden',
    });
    expect(response.statusCode).toBe(400);
  });

  test('Login to an existing user', async () => {
    const response = await request(server).post('/admin/auth/login').send({
      email: 'hayden.smith@unsw.edu.au',
      password: 'bananapie',
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.token instanceof String);
  });

  test('Login attempt with invalid credentials 1', async () => {
    const response = await request(server).post('/admin/auth/login').send({
      email: 'hayden.smith@unsw.edu.a',
      password: 'bananapie',
    });
    expect(response.statusCode).toBe(400);
  });

  test('Login attempt with invalid credentials 2', async () => {
    const response = await request(server).post('/admin/auth/login').send({
      email: 'hayden.smith@unsw.edu.au',
      password: 'bananapi',
    });
    expect(response.statusCode).toBe(400);
  });

  test('Logout a valid session', async () => {
    const response = await request(server).post('/admin/auth/login').send({
      email: 'hayden.smith@unsw.edu.au',
      password: 'bananapie',
    });
    const token = response.body.token;
    const response2 = await request(server)
      .post('/admin/auth/logout')
      .set('Authorization', `Bearer ${token}`)
      .send({});
    expect(response2.statusCode).toBe(200);
    console.log(response2.body);
    expect(response2.body).toMatchObject({});
  });


  test('Logout a session without auth token', async () => {
    const response = await request(server).post('/admin/auth/login').send({
      email: 'hayden.smith@unsw.edu.au',
      password: 'bananapie',
    });
    const token = response.body.token;
    const response2 = await request(server)
      .post('/admin/auth/logout')
      .send({});
    expect(response2.statusCode).toBe(403);
    console.log(response2.body);
    expect(response2.body).toMatchObject({});
  });

  /***************************************************************
                       Auth Tests
  ***************************************************************/


});