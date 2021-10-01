const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/badRequestError');
const UnauthorizedError = require('../errors/unauthorizedError');
const NotFoundError = require('../errors/notFoundError');
const ConflictError = require('../errors/conflictError');
const ServerError = require('../errors/serverError');

const { NODE_ENV, JWT_SECRET } = process.env;

const getUserFile = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => next(new NotFoundError('Пользователь с указанным _id не найден.')))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(next);
};

const getUsersInfo = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch(() => {
      next(new ServerError('Некорректный запрос к серверу.'));
    });
};

const getUserId = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(new Error('NotFound'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некоректный запрос.'));
      }
      if (err.message === 'NotFound') {
        next(new NotFoundError('_id пользователя не найден.'));
      } else {
        next(new ServerError('Ошибка на сервере.'));
      }
    });
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      res.send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Некорректные данные.'));
      } else if (err.name === 'MongoError' && err.code === 11000) {
        next(new ConflictError('Указанный пользователь уже зарегистрирован.'));
      } else {
        next(new ServerError('Ошибка на сервере.'));
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'super-strong-secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      next(new UnauthorizedError(`Необходимо авторизоваться: ${err.message}`));
    });
};

const userInfo = (req, res, next) => {
  const userId = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .orFail(new NotFoundError('NotFound'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданны некоректные данные при обновления профиля.'));
      }
      if (err.message === 'NotFound') {
        next(new NotFoundError('_id пользователя не найден.'));
      } else {
        next(new ServerError('Ошибка на сервере.'));
      }
    });
};

const avatarUpdate = (req, res, next) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .orFail(new Error('NotFound'))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданны некоректные данные при обновления аватара.'));
      }
      if (err.message === 'NotFound') {
        next(new NotFoundError('_id пользователя не найден.'));
      } else {
        next(new ServerError('Ошибка на сервере.'));
      }
    });
};

module.exports = {
  getUsersInfo, getUserId, createUser, userInfo, avatarUpdate, login, getUserFile,
};
