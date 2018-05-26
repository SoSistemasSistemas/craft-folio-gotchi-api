const express = require('express');
const jwt = require('jsonwebtoken');
const parameters = require('parameters-middleware');
const { CREATED, BAD_REQUEST, OK } = require('http-status-codes');

const User = require('../models/user.model');
const encryptionService = require('../services/encryption.service');

const { REQUIRED_PARAMETERS_ERROR_MESSAGE } = require('../constants/message.constant');

const router = express.Router();

const { JWT_SECRET } = process.env;

function validateCreationOfUserAlreadyRegistred(username) {
  return new Promise((resolve, reject) => {
    User.findOne({ username })
      .then((user) => {
        if (user) return reject(new Error('E-mail já cadastrado na base.'));
        resolve();
      });
  });
}

function registerNewUser(username, password) {
  return new Promise(async (resolve, reject) => {
    let newUser = new User({
      username,
      password: await encryptionService.cryptPassword(password),
    });

    newUser.save((err) => {
      if (err) return reject(err);

      newUser = newUser.toObject();
      delete newUser.password;
      resolve(newUser);
    });
  });
}

function validateUserPassword(user, informedPassword) {
  return encryptionService
    .comparePassword(informedPassword, user.password)
    .then((isMatch) => {
      if (!isMatch) throw new Error('Senha incorreta.');

      const response = user.toObject();
      delete response.password;
      return response;
    });
}

function attachJsonWebToken(user) {
  const token = jwt.sign(user, JWT_SECRET, { expiresIn: '1d' });

  if (!token) throw new Error('Falha ao gerar token de autenticação.');
  return { ...user, token };
}

router
  .route('/')
  .post(
    parameters({ body: ['username', 'password'] }, { message: REQUIRED_PARAMETERS_ERROR_MESSAGE }),
    (req, res) => {
      const { username, password } = req.body;
      validateCreationOfUserAlreadyRegistred(username)
        .then(() => registerNewUser(username, password))
        .then(user => attachJsonWebToken(user))
        .then(response => res.status(CREATED).json(response))
        .catch(error => res.status(BAD_REQUEST).json({ error: error.message }));
    },
  );

router
  .route('/login')
  .post(
    parameters({ body: ['username', 'password'] }, { message: REQUIRED_PARAMETERS_ERROR_MESSAGE }),
    (req, res) => {
      const { username, password } = req.body;

      User
        .findOne({ username })
        .then(user => validateUserPassword(user, password))
        .then(user => attachJsonWebToken(user))
        .then(response => res.status(OK).json(response))
        .catch(error => res.status(BAD_REQUEST).json({ error: error.message }));
    },
  );

module.exports = router;
