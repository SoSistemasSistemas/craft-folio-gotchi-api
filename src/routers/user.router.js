const express = require('express');
const {
  OK, INTERNAL_SERVER_ERROR, NOT_FOUND, NO_CONTENT,
} = require('http-status-codes');

const User = require('../models/user.model');
const World = require('../models/world.model');

const authentication = require('../middlewares/authentication.middleware');

const router = express.Router();

router
  .route('/:username/avatar')
  .put(
    authentication,
    (req, res) => {
      const { username } = req.params;
      const { url } = req.body;

      User.findOneAndUpdate({ username }, { 'avatar.url': url })
        .then(() => World.findOneAndUpdate({ 'owner.username': username }, { 'owner.avatarUrl': url }))
        .then(() => res.status(NO_CONTENT).json())
        .catch(error => res.status(INTERNAL_SERVER_ERROR).json({ error }));
    },
  );

router
  .route('/:username/tokenWebPush')
  .put(
    authentication,
    (req, res) => {
      const { username } = req.params;
      const { token } = req.body;

      User.findOneAndUpdate({ username }, { webPushToken: token })
        .then(() => World.findOneAndUpdate({ 'owner.username': username }, { 'owner.webPushToken': token }))
        .then(() => res.status(NO_CONTENT).json())
        .catch(error => res.status(INTERNAL_SERVER_ERROR).json({ error }));
    },
  );

router
  .route('/:_id')
  .get(
    authentication,
    (req, res) => {
      const { _id } = req.params;

      User.findOne({ _id }, { password: 0 })
        .then(user => (user ? res.status(OK).json(user) : res.status(NOT_FOUND).json(user)))
        .catch(error => res.status(INTERNAL_SERVER_ERROR).json({ error }));
    },
  )
  .delete(
    authentication,
    (req, res) => {
      const { _id } = req.params;

      User.remove({ _id })
        .then(() => res.status(NO_CONTENT).json())
        .catch(error => res.status(INTERNAL_SERVER_ERROR).json({ error }));
    },
  );

router
  .route('/')
  .get(
    authentication,
    (req, res) => {
      User.find({}, { password: 0 })
        .then(user => res.status(OK).json(user))
        .catch(error => res.status(INTERNAL_SERVER_ERROR).json({ error }));
    },
  );

module.exports = router;
