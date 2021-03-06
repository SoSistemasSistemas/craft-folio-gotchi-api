/* eslint-disable no-underscore-dangle */

const test = require('ava');

const internalRequest = require('../util/internalRequest.util');

const { BAD_REQUEST, OK, CREATED } = require('http-status-codes');
const {
  REQUIRED_PARAMETERS_ERROR_MESSAGE, WRONG_PASSWORD, USER_ALREADY_REGISTRED,
} = require('../../src/constants/message.constant');

const API_AUTH_URL = 'http://localhost:3000/auth';
const API_USER_URL = 'http://localhost:3000/users';

let testUser = {
  username: '__test__',
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

test('Login without username field', async (t) => {
  const { password } = testUser;
  const response = await internalRequest.post(`${API_AUTH_URL}/login`, { password });

  t.is(response.statusCode, BAD_REQUEST);
  t.is(response.body, REQUIRED_PARAMETERS_ERROR_MESSAGE);
});
test('Login without password field', async (t) => {
  const { username } = testUser;
  const response = await internalRequest.post(`${API_AUTH_URL}/login`, { username });

  t.is(response.statusCode, BAD_REQUEST);
  t.is(response.body, REQUIRED_PARAMETERS_ERROR_MESSAGE);
});
test('Login credentials invalid', async (t) => {
  const { username } = testUser;
  const password = '123456';

  const response = await internalRequest.post(`${API_AUTH_URL}/login`, { username, password });

  t.is(response.statusCode, BAD_REQUEST);
  t.is(response.body.error, WRONG_PASSWORD);
});
test('Login successfully', async (t) => {
  const response = await internalRequest.post(`${API_AUTH_URL}/login`, testUser);
  const { statusCode, body } = response;

  t.context.user = body;

  t.is(statusCode, OK);
  t.is(body.username, testUser.username);
  t.falsy(body.password);
  t.truthy(body._id);
  t.truthy(body.token);
});

test('Signup without username field', async (t) => {
  const password = '12345';
  const response = await internalRequest.post(`${API_AUTH_URL}`, { password });

  t.is(response.statusCode, BAD_REQUEST);
  t.is(response.body, REQUIRED_PARAMETERS_ERROR_MESSAGE);
});
test('Signup without password field', async (t) => {
  const username = '__test2__@craftfoliogotchi.com';
  const response = await internalRequest.post(`${API_AUTH_URL}`, { username });

  t.is(response.statusCode, BAD_REQUEST);
  t.is(response.body, REQUIRED_PARAMETERS_ERROR_MESSAGE);
});
test('Signup with e-mail already registred', async (t) => {
  const response = await internalRequest.post(`${API_AUTH_URL}`, testUser);

  t.is(response.statusCode, BAD_REQUEST);
  t.is(response.body.error, USER_ALREADY_REGISTRED);
});
test('Signup successfully', async (t) => {
  const username = '__test2__';
  const password = '12345';

  const response = await internalRequest.post(`${API_AUTH_URL}`, { username, password });
  const { statusCode, body } = response;

  t.context.user = body;

  t.is(statusCode, CREATED);
  t.is(body.username, username);
  t.falsy(body.password);
  t.truthy(body._id);
  t.truthy(body.token);
});
