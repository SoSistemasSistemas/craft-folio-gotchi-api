const test = require('ava');

const internalRequest = require('../util/internalRequest.util');

const { OK, UNAUTHORIZED, NOT_FOUND } = require('http-status-codes');
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
  const { world } = t.context;

  if (world) {
    const headers = { 'x-access-token': testUser.token || '' };
    await internalRequest.delete(`${API_WORLD_URL}/${world._id}`, headers);
  }
});

test('List all worlds not authenticated', async (t) => {
  const response = await internalRequest.get(`${API_WORLD_URL}/`);

  t.is(response.statusCode, UNAUTHORIZED);
  t.is(response.body.error, USER_NOT_AUTHENTICATED);
});
test('List all worlds', async (t) => {
  const headers = { 'x-access-token': testUser.token || '' };
  const response = await internalRequest.get(`${API_WORLD_URL}/`, headers);
  const { statusCode, body } = response;

  t.is(statusCode, OK);
  t.true(Array.isArray(body));
});

test.todo('Get world not authenticated');
test.todo('Get not registred world');
test.todo('Get world');

test.todo('Create world not authenticated');
test.todo('Create world');

test.todo('Update world not authenticated');
test.todo('Update world without ownership');
test.todo('Delete world');

test.todo('Delete world not authenticated');
test.todo('Delete world without ownership');
test.todo('Delete world');
