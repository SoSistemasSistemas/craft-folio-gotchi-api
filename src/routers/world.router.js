const express = require('express');
const {
  OK, INTERNAL_SERVER_ERROR, NOT_FOUND, CREATED, NO_CONTENT,
} = require('http-status-codes');

const World = require('../models/world.model');

const authentication = require('../middlewares/authentication.middleware');
const worldOwnership = require('../middlewares/worldOwnership.middleware');

const notificationService = require('../services/notification.service');
const widgetService = require('../services/widget.service');

const { FRONT_END_URI, NODE_ENV } = process.env;

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

      World
        .findOneAndUpdate({ 'owner.username': ownerUsername }, { widgets: { ...req.body } })
        .then(() => res.status(NO_CONTENT).json())
        .catch(error => res.status(INTERNAL_SERVER_ERROR).json({ error }));
    },
  );

const addVisitor = (world, visitor) => {
  const alreadyVisitor = world.visitors.map(v => v.username).includes(visitor.username);

  if (visitor.username !== world.owner.username && !alreadyVisitor) {
    world.visitors.push({
      _id: visitor._id,
      username: visitor.username,
      avatar: visitor.avatar,
    });

    return world.save().then(() => world);
  }

  return world;
};

const defineOwnership =
  (world, user) => ({ ...world._doc, isOwner: world.owner.username === user.username });

const notifyOwnerAboutNewVisits = (world) => {
  const visitsCount = world.visitors.length;

  const title = `Parabéns, ${world.owner.username}!`;
  const message = `Seu mundo acaba de atingir ${visitsCount} visitas únicas!`;

  if (world.owner.webPushToken && NODE_ENV !== 'production') {
    const data = {
      title,
      options: {
        body: message,
        icon: world.owner.avatarUrl,
        data: {
          click_action: `${FRONT_END_URI}/worlds/${world.owner.username}`,
        },
      },
    };

    notificationService.sendWebPushNotification({ token: world.owner.webPushToken, data });
  }
};

router
  .route('/:ownerUsername')
  .get(
    authentication,
    (req, res) => {
      const { ownerUsername } = req.params;

      let oldVisitsCount;
      World.findOne({ 'owner.username': ownerUsername })
        .then((world) => {
          oldVisitsCount = world.visitors.length;

          return world;
        })
        .then(world => addVisitor(world, req.user))
        .then(world => defineOwnership(world, req.user))
        .then((world) => {
          if (!world.isOwner && world.visitors.length > oldVisitsCount) {
            notifyOwnerAboutNewVisits(world);
          }

          return world;
        })
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
