const express = require('express');
const { OK } = require('http-status-codes');

const avatarService = require('../services/avatar.service');
const authentication = require('../middlewares/authentication.middleware');

const router = express.Router();

router
  .route('/')
  .get(
    authentication,
    (req, res) => res.status(OK).json(avatarService.getAll()),
  );

module.exports = router;
