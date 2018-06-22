const express = require('express');
const {
  OK, INTERNAL_SERVER_ERROR, NOT_FOUND, CREATED, NO_CONTENT, FORBIDDEN
} = require('http-status-codes');

const World = require('../models/world.model');

const authentication = require('../middlewares/authentication.middleware');
const worldOwnership = require('../middlewares/worldOwnership.middleware');

const widgetService = require('../services/widget.service');

const router = express.Router();

router
  .route('/:ownerUsername/widgets')
  .put(
    [
      authentication,
      worldOwnership,
    ],
    (req, res) => {
      const { ownerUsername } = req.params;

      if (req.user.username === ownerUsername) {

        World.findOneAndUpdate({ 'owner.username': ownerUsername }, { widgets: { ...req.body } })
          .then(() => res.status(NO_CONTENT).json())
          .catch(error => res.status(INTERNAL_SERVER_ERROR).json({ error }));

      } else {
        res.status(FORBIDDEN).json();
      }
    },
  );

router
  .route('/:ownerUsername')
  .get(
    authentication,
    (req, res) => {
      const { ownerUsername } = req.params;

      World.findOne({ 'owner.username': ownerUsername })
        .then(world => (world ? res.status(OK).json(world) : res.status(NOT_FOUND).json(world)))
        .catch(error => res.status(INTERNAL_SERVER_ERROR).json({ error }));
    },
  )
  .delete(
    [
      authentication,
      worldOwnership,
    ],
    (req, res) => {
      const { ownerUsername } = req.params;

      World.remove({ 'owner.username': ownerUsername })
        .then(() => res.status(NO_CONTENT).json())
        .catch(error => res.status(INTERNAL_SERVER_ERROR).json({ error }));
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
        username: user.username,
        avatarUrl: user.avatar.url,
      };

      const world = new World();
      world.owner = owner;
      world.widgets = widgets || widgetService.getDefaultWidgets();
      world.visitsCount = visitsCount || 0;

      world.save((error) => {
        if (error) return res.status(INTERNAL_SERVER_ERROR).json({ error });

        res.status(CREATED).json(world);
      });
    },
  );

module.exports = router;
