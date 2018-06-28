const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSimpleSchema = new Schema({
  _id: Schema.Types.ObjectId,
  username: String,
  avatarUrl: String,
  webPushToken: String,
}, { strict: false, versionKey: false });

const widgetSchema = new Schema({}, { _id: false, versionKey: false, strict: false });

const worldSchema = new Schema({
  owner: { type: userSimpleSchema, required: true },
  widgets: { type: widgetSchema, default: {} },
  visitors: { type: [userSimpleSchema], default: [] },
}, { collection: 'worlds', versionKey: false });

module.exports = mongoose.model('World', worldSchema);
