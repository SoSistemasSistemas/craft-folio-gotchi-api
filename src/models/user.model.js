const mongoose = require('mongoose');

const { Schema } = mongoose;

const avatarSchema = new Schema({
  url: String,
  state: String,
}, { _id: false, versionKey: false });

const userSchema = new Schema({
  username: String,
  password: String,
  webPushToken: String,
  idWorld: Schema.Types.ObjectId,
  avatar: avatarSchema,
}, { collection: 'users', versionKey: false });

module.exports = mongoose.model('User', userSchema);
