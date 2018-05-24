const express = require('express');
const { OK, INTERNAL_SERVER_ERROR, NOT_FOUND } = require('http-status-codes');

const User = require('../models/user.model');

const authentication = require('../middlewares/authentication.middleware');

const router = express.Router();

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
        .then(() => res.status(OK).json())
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
