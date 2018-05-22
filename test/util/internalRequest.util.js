const got = require('got');

exports.get = async (url, headers = {}) => {
  try {
    const response = await got.get(url, { json: true, headers });
    return response;
  } catch (error) {
    return error.response;
  }
};

exports.post = async (url, body, headers = {}) => {
  try {
    const response = await got.post(url, { json: true, body, headers });
    return response;
  } catch (error) {
    return error.response;
  }
};

exports.put = async (url, body, headers = {}) => {
  try {
    const response = await got.put(url, { json: true, body, headers });
    return response;
  } catch (error) {
    return error.response;
  }
};

exports.delete = async (url, headers = {}) => {
  try {
    const response = await got.delete(url, { json: true, headers });
    return response;
  } catch (error) {
    return error.response;
  }
};
