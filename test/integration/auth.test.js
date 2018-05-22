/* eslint-disable no-underscore-dangle */

const test = require('ava');

const internalRequest = require('../util/internalRequest.util');

const { BAD_REQUEST, OK, ACCEPTED } = require('http-status-codes');
const { REQUIRED_PARAMETERS_ERROR_MESSAGE } = require('../../src/constants/message.constant');

const API_AUTH_URL = 'http://localhost:3000/auth';
const API_USER_URL = 'http://localhost:3000/users';

let testUser = {
  email: '__test__@craftfoliogotchi.com',
  password: '12345',
};

test.before(async () => {
  const response = await internalRequest.post(`${API_AUTH_URL}`, testUser);
  testUser = Object.assign(testUser, response.body);
});

test.after(async () => {
  const headers = { 'x-access-token': testUser.token || '' };
  await internalRequest.delete(`${API_USER_URL}/${testUser._id}`, headers);
});

test.afterEach(async (t) => {
  const { user } = t.context;

  if (t.context.user) {
    const headers = { 'x-access-token': user.token || '' };
    await internalRequest.delete(`${API_USER_URL}/${user._id}`, headers);
  }
});

test('Login without email field', async (t) => {
  const { password } = testUser;
  const response = await internalRequest.post(`${API_AUTH_URL}/login`, { password });

  t.is(response.statusCode, BAD_REQUEST);
  t.is(response.body, REQUIRED_PARAMETERS_ERROR_MESSAGE);
});
test('Login without password field', async (t) => {
  const { email } = testUser;
  const response = await internalRequest.post(`${API_AUTH_URL}/login`, { email });

  t.is(response.statusCode, BAD_REQUEST);
  t.is(response.body, REQUIRED_PARAMETERS_ERROR_MESSAGE);
});
test('Login credentials invalid', async (t) => {
  const { email } = testUser;
  const password = '123456';

  const response = await internalRequest.post(`${API_AUTH_URL}/login`, { email, password });

  t.is(response.statusCode, BAD_REQUEST);
  t.is(response.body.error, 'Senha incorreta.');
});
test('Login successfully', async (t) => {
  const response = await internalRequest.post(`${API_AUTH_URL}/login`, testUser);
  const { statusCode, body } = response;

  t.context.user = body;

  t.is(statusCode, OK);
  t.is(body.email, testUser.email);
  t.falsy(body.password);
  t.truthy(body._id);
  t.truthy(body.token);
});

test('Signup without email field', async (t) => {
  const password = '12345';
  const response = await internalRequest.post(`${API_AUTH_URL}`, { password });

  t.is(response.statusCode, BAD_REQUEST);
  t.is(response.body, REQUIRED_PARAMETERS_ERROR_MESSAGE);
});
test('Signup without password field', async (t) => {
  const email = '__test2__@craftfoliogotchi.com';
  const response = await internalRequest.post(`${API_AUTH_URL}`, { email });

  t.is(response.statusCode, BAD_REQUEST);
  t.is(response.body, REQUIRED_PARAMETERS_ERROR_MESSAGE);
});
test('Signup with e-mail already registred', async (t) => {
  const response = await internalRequest.post(`${API_AUTH_URL}`, testUser);

  t.is(response.statusCode, BAD_REQUEST);
  t.is(response.body.error, 'E-mail já cadastrado na base.');
});
test('Signup successfully', async (t) => {
  const email = '__test2__@craftfoliogotchi.com';
  const password = '12345';

  const response = await internalRequest.post(`${API_AUTH_URL}`, { email, password });
  const { statusCode, body } = response;

  t.context.user = body;

  t.is(statusCode, ACCEPTED);
  t.is(body.email, email);
  t.falsy(body.password);
  t.truthy(body._id);
  t.truthy(body.token);
});
