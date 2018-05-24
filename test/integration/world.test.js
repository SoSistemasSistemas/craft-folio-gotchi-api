const test = require('ava');

const internalRequest = require('../util/internalRequest.util');

const {
  OK, UNAUTHORIZED, NOT_FOUND, CREATED,
} = require('http-status-codes');
const { USER_NOT_AUTHENTICATED } = require('../../src/constants/message.constant');

const API_AUTH_URL = 'http://localhost:3000/auth';
const API_USER_URL = 'http://localhost:3000/users';
const API_WORLD_URL = 'http://localhost:3000/worlds';

let testUser = {
  email: '__test_world__@craftfoliogotchi.com',
  password: '12345',
};

let testWorld;

test.before(async () => {
  let response = await internalRequest.post(`${API_AUTH_URL}`, testUser);
  testUser = Object.assign(testUser, response.body);

  testWorld = {
    owner: {
      _id: testUser._id,
      email: testUser.email,
    },
    visitsCount: 5,
    widgets: [{ type: 'outdoor' }],
  };

  const headers = { 'x-access-token': testUser.token || '' };
  response = await internalRequest.post(`${API_WORLD_URL}`, testWorld, headers);
  testWorld = Object.assign(testWorld, response.body);
});

test.after(async () => {
  const headers = { 'x-access-token': testUser.token || '' };
  await internalRequest.delete(`${API_USER_URL}/${testUser._id}`, headers);
  await internalRequest.delete(`${API_WORLD_URL}/${testWorld._id}`, headers);
});

test.afterEach(async (t) => {
  const { world, user } = t.context;

  if (world && user) {
    const headers = { 'x-access-token': user.token || '' };
    await internalRequest.delete(`${API_WORLD_URL}/${world._id}`, headers);
  }

  if (user) {
    const headers = { 'x-access-token': testUser.token || '' };
    await internalRequest.delete(`${API_USER_URL}/${user._id}`, headers);
  }
});

test('List all worlds not authenticated', async (t) => {
  const response = await internalRequest.get(`${API_WORLD_URL}/`);

  t.is(response.statusCode, UNAUTHORIZED);
  t.is(response.body.error, USER_NOT_AUTHENTICATED);
});
test('List all worlds successfully', async (t) => {
  const headers = { 'x-access-token': testUser.token || '' };
  const response = await internalRequest.get(`${API_WORLD_URL}/`, headers);
  const { statusCode, body } = response;

  t.is(statusCode, OK);
  t.true(Array.isArray(body));
});

test('Get world not authenticated', async (t) => {
  const response = await internalRequest.get(`${API_WORLD_URL}/${testWorld._id}`);

  t.is(response.statusCode, UNAUTHORIZED);
  t.is(response.body.error, USER_NOT_AUTHENTICATED);
});
test('Get not registred world', async (t) => {
  const headers = { 'x-access-token': testUser.token || '' };
  const response = await internalRequest.get(`${API_WORLD_URL}/5af7aed5992f2e3dd7be54e6`, headers);

  t.is(response.statusCode, NOT_FOUND);
  t.falsy(response.body);
});
test('Get world successfully', async (t) => {
  const headers = { 'x-access-token': testUser.token || '' };
  const response = await internalRequest.get(`${API_WORLD_URL}/${testWorld._id}`, headers);

  t.is(response.statusCode, OK);
  t.truthy(response.body);
});

test('Create world not authenticated', async (t) => {
  const response = await internalRequest.post(`${API_WORLD_URL}`, {});

  t.is(response.statusCode, UNAUTHORIZED);
  t.is(response.body.error, USER_NOT_AUTHENTICATED);
});
test('Create world successfully', async (t) => {
  let newUser = {
    email: '__test_world_2__@craftfoliogotchi.com',
    password: '54321',
  };

  let response = await internalRequest.post(`${API_AUTH_URL}`, newUser);
  newUser = Object.assign(newUser, response.body);

  t.context.user = newUser;

  const headers = { 'x-access-token': newUser.token || '' };
  response = await internalRequest.post(`${API_WORLD_URL}`, newUser, headers);

  const { statusCode, body } = response;

  t.context.world = body;

  t.is(statusCode, CREATED);
  t.truthy(body);
  t.is(body.owner._id.toString(), newUser._id.toString());
});

test.todo('Update world not authenticated');
test.todo('Update world without ownership');
test.todo('Update world successfully');

test.todo('Delete world not authenticated');
test.todo('Delete world without ownership');
test.todo('Delete world successfully');
