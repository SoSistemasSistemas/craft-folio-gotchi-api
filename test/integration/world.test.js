/* eslint-disable no-underscore-dangle */

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

test.todo('List all worlds not authenticated');
test.todo('List all worlds');

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
