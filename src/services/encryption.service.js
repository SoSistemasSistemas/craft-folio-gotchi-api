const bcrypt = require('bcrypt');

exports.cryptPassword = password => new Promise((resolve, reject) => {
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return reject(err);

    bcrypt.hash(password, salt, (err, hash) => {
      if (err) return reject(err);
      resolve(hash);
    });
  });
});

exports.comparePassword = (plainPassword, hashword) => new Promise((resolve, reject) => {
  bcrypt.compare(plainPassword, hashword, (err, isPasswordMatch) => {
    if (err) return reject(err);
    resolve(isPasswordMatch);
  });
});
