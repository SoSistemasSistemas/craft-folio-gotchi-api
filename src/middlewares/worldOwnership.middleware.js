const { UNAUTHORIZED, BAD_REQUEST, NOT_FOUND } = require('http-status-codes');
const { WORLD_OWNERSHIP_REQUIRED } = require('../constants/message.constant');

const World = require('../models/world.model');

module.exports = (req, res, next) => {
  World.findOne({ 'owner.username': req.user.username })
    .then((world) => {
      if (!world) {
        return res.status(NOT_FOUND).json(world);
      }
      if (world.owner._id.toString() !== req.user._id.toString()) {
        return res.status(UNAUTHORIZED).json({ error: WORLD_OWNERSHIP_REQUIRED });
      }

      req.world = world;
      next();
    })
    .catch(error => res.status(BAD_REQUEST).json({ error }));
};
