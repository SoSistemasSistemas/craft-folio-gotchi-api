const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  email: String,
  password: String,
}, {
  collection: 'user',
  versionKey: false,
});

module.exports = mongoose.model('User', userSchema);
