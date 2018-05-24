const test = require('ava');

const internalRequest = require('../util/internalRequest.util');
const entityFactory = require('../util/entityFactory.util');

const {
  OK, UNAUTHORIZED, NOT_FOUND, CREATED,
} = require('http-status-codes');
const { USER_NOT_AUTHENTICATED } = require('../../src/constants/message.constant');

const API_USER_URL = 'http://localhost:3000/users';
const API_WORLD_URL = 'http://localhost:3000/worlds';

test.afterEach(async (t) => {
  const { world, user } = t.context;

  if (user) {
    const headers = { 'x-access-token': user.token || '' };
    await internalRequest.delete(`${API_USER_URL}/${user._id}`, headers);

    if (world) {
      const headers = { 'x-access-token': user.token || '' };
      await internalRequest.delete(`${API_WORLD_URL}/${world._id}`, headers);
    }
  }
});

test('List all worlds not authenticated', async (t) => {
  const response = await internalRequest.get(`${API_WORLD_URL}/`);
  const { statusCode, body } = response;

  t.is(statusCode, UNAUTHORIZED);
  t.is(body.error, USER_NOT_AUTHENTICATED);
});
test('List all worlds successfully', async (t) => {
  const user = await entityFactory.createRandomUser();

  const headers = { 'x-access-token': user.token || '' };
  const response = await internalRequest.get(`${API_WORLD_URL}/`, headers);
  const { statusCode, body } = response;

  t.is(statusCode, OK);
  t.true(Array.isArray(body));

  t.context.user = user;
});

test('Get world not authenticated', async (t) => {
  const response = await internalRequest.get(`${API_WORLD_URL}/123`);
  const { statusCode, body } = response;

  t.is(statusCode, UNAUTHORIZED);
  t.is(body.error, USER_NOT_AUTHENTICATED);
});
test('Get not registred world', async (t) => {
  const user = await entityFactory.createRandomUser();

  const headers = { 'x-access-token': user.token || '' };
  const response = await internalRequest.get(`${API_WORLD_URL}/5af7aed5992f2e3dd7be54e6`, headers);
  const { statusCode, body } = response;

  t.is(statusCode, NOT_FOUND);
  t.falsy(body);

  t.context.user = user;
});
test('Get world successfully', async (t) => {
  const user = await entityFactory.createRandomUser();
  const { world } = await entityFactory.createRandomWorld();

  const headers = { 'x-access-token': user.token || '' };
  const response = await internalRequest.get(`${API_WORLD_URL}/${world._id}`, headers);
  const { statusCode, body } = response;

  t.is(statusCode, OK);
  t.truthy(body);
  t.deepEqual(body, world);

  t.context.user = user;
  t.context.world = world;
});

test('Create world not authenticated', async (t) => {
  const response = await internalRequest.post(`${API_WORLD_URL}`, {});
  const { statusCode, body } = response;

  t.is(statusCode, UNAUTHORIZED);
  t.is(body.error, USER_NOT_AUTHENTICATED);
});
test('Create world successfully', async (t) => {
  const user = await entityFactory.createRandomUser();

  const headers = { 'x-access-token': user.token || '' };
  const response = await internalRequest.post(`${API_WORLD_URL}`, {}, headers);
  const { statusCode, body } = response;

  t.is(statusCode, CREATED);
  t.truthy(body);
  t.is(body.owner._id.toString(), user._id.toString());

  t.context.user = user;
});

test.todo('Update world not authenticated');
test.todo('Update world without ownership');
test.todo('Update world successfully');

test.todo('Delete world not authenticated');
test.todo('Delete world without ownership');
test.todo('Delete world successfully');
