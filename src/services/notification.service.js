const got = require('got');

const { FIREBASE_SERVER_KEY, FIREBASE_SENDER_URI } = process.env;

exports.sendWebPushNotification = ({ token, data }) => {
  const body = { data, to: token };
  const headers = { Authorization: `key=${FIREBASE_SERVER_KEY}` };

  return got
    .post(FIREBASE_SENDER_URI, { body, headers, json: true })
    .then(response => response.body);
};
