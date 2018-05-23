const mongoose = require('mongoose');

const { Schema } = mongoose;

const ownerSchema = new Schema({
  _id: Schema.Types.ObjectId,
  email: String,
}, { versionKey: false });

const widgetSchema = new Schema({
  type: String,
}, { versionKey: false, strict: false });

const worldSchema = new Schema({
  owner: { type: ownerSchema, required: true },
  widgets: { type: [widgetSchema], default: [] },
  visitsCount: { type: Number, default: 0 },
}, { collection: 'worlds', versionKey: false });

module.exports = mongoose.model('World', worldSchema);
