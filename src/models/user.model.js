const mongoose = require('mongoose');

const { Schema } = mongoose;

const avatarSchema = new Schema({
  bodyUrl: String,
  state: String,
}, { versionKey: false });

const userSchema = new Schema({
  email: String,
  password: String,
  idWorld: Schema.Types.ObjectId,
  avatar: avatarSchema,
}, { collection: 'users', versionKey: false });

module.exports = mongoose.model('User', userSchema);
