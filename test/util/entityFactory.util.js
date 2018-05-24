const internalRequest = require('../util/internalRequest.util');

const API_AUTH_URL = 'http://localhost:3000/auth';
const API_WORLD_URL = 'http://localhost:3000/worlds';

const random = limit => Math.floor(Math.random() * limit, 0);

exports.createRandomUser = async () => {
  const user = {
    email: `__test_world_${random(1000)}__@craftfoliogotchi.com`,
    password: `${random(100000)}`,
  };

  const response = await internalRequest.post(`${API_AUTH_URL}`, user);
  return response.body;
};

exports.createRandomWorld = async () => {
  const owner = await this.createRandomUser();

  const headers = { 'x-access-token': owner.token || '' };
  const response = await internalRequest.post(`${API_WORLD_URL}`, {}, headers);

  const world = response.body;
  world.owner.token = owner.token;

  return world;
};
