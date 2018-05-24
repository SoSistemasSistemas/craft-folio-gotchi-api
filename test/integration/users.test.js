/* eslint-disable no-underscore-dangle */

const test = require('ava');

const internalRequest = require('../util/internalRequest.util');

const {
  OK, UNAUTHORIZED, NOT_FOUND, NO_CONTENT,
} = require('http-status-codes');
const { USER_NOT_AUTHENTICATED } = require('../../src/constants/message.constant');

const API_AUTH_URL = 'http://localhost:3000/auth';
const API_USER_URL = 'http://localhost:3000/users';

let testUser = {
  email: '__test_user__@craftfoliogotchi.com',
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

test('List all users not authenticated', async (t) => {
  const response = await internalRequest.get(`${API_USER_URL}/`);

  t.is(response.statusCode, UNAUTHORIZED);
  t.is(response.body.error, USER_NOT_AUTHENTICATED);
});
test('List all users', async (t) => {
  const headers = { 'x-access-token': testUser.token || '' };
  const response = await internalRequest.get(`${API_USER_URL}/`, headers);
  const { statusCode, body } = response;

  t.is(statusCode, OK);
  t.true(Array.isArray(body));
  t.true(body.length > 0);
  t.truthy(body.find(u => u._id === testUser._id));
});

test('Get user not authenticated', async (t) => {
  const response = await internalRequest.get(`${API_USER_URL}/${testUser._id}`);

  t.is(response.statusCode, UNAUTHORIZED);
  t.is(response.body.error, USER_NOT_AUTHENTICATED);
});
test('Get not registred user', async (t) => {
  const headers = { 'x-access-token': testUser.token || '' };
  const response = await internalRequest.get(`${API_USER_URL}/5af7aed5992f2e3dd7be54e6`, headers);

  t.is(response.statusCode, NOT_FOUND);
  t.falsy(response.body);
});
test('Get user', async (t) => {
  const headers = { 'x-access-token': testUser.token || '' };
  const response = await internalRequest.get(`${API_USER_URL}/${testUser._id}`, headers);

  t.is(response.statusCode, OK);
  t.truthy(response.body);
});
test('Delete user', async (t) => {
  const headers = { 'x-access-token': testUser.token || '' };

  let response = await internalRequest.get(`${API_USER_URL}/${testUser._id}`, headers);
  t.is(response.statusCode, OK);
  t.truthy(response.body);

  response = await internalRequest.delete(`${API_USER_URL}/${testUser._id}`, headers);
  t.is(response.statusCode, NO_CONTENT);

  response = await internalRequest.get(`${API_USER_URL}/${testUser._id}`, headers);
  t.is(response.statusCode, NOT_FOUND);
  t.falsy(response.body);
});
