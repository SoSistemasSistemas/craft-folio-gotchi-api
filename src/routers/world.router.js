const express = require('express');
const {
  OK, BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND,
} = require('http-status-codes');

const World = require('../models/world.model');

const authentication = require('../middlewares/authentication.middleware');
const worldOwnership = require('../middlewares/worldOwnership.middleware');

const router = express.Router();

router
  .route('/:_id')
  .get(
    authentication,
    (req, res) => {
      const { _id } = req.params;

      World.findOne({ _id })
        .then(world => (world ? res.status(OK).json(world) : res.status(NOT_FOUND).json(world)))
        .catch(error => res.status(BAD_REQUEST).json({ error }));
    },
  )
  .delete(
    [
      authentication,
      worldOwnership,
    ],
    (req, res) => {
      const { _id } = req.params;

      World.remove({ _id })
        .then(() => res.status(OK).json())
        .catch(error => res.status(BAD_REQUEST).json({ error }));
    },
  );

router
  .route('/')
  .get(
    authentication,
    (req, res) => {
      World.find({}, { password: 0 })
        .then(user => res.status(OK).json(user))
        .catch(error => res.status(INTERNAL_SERVER_ERROR).json({ error }));
    },
  )
  .post(
    authentication,
    (req, res) => {
      const { user, body } = req;
      const { widgets, visitsCount } = body;
      const owner = {
        _id: user._id,
        email: user.email,
      };

      const world = new World();
      world.owner = owner;
      world.widgets = widgets || [];
      world.visitsCount = visitsCount || 0;

      world.save((error) => {
        if (error) return res.status(INTERNAL_SERVER_ERROR).json({ error });

        res.status(OK).json(world);
      });
    },
  );

module.exports = router;