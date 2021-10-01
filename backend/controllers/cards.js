const Card = require('../models/card');
const ForbiddenError = require('../errors/forbiddenError');
const NotFoundError = require('../errors/notFoundError');
const BadRequestError = require('../errors/badRequestError');

const getCard = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некоректные данные при создании карточки.'));
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => next(new NotFoundError('Карточка с указанным _id не найдена.')))
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        next(new ForbiddenError('Нет прав для удаления карточки.'));
      } else {
        Card.findByIdAndRemove(req.params.cardId)
          .then(() => {
            res.status(200).send(card);
          });
      }
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true })
    .orFail(new Error('NotFound'))
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданны некоректные данные для постановки/снятия лайка.'));
      }
      if (err.message === 'NotFound') {
        next(new NotFoundError('Карточка с указанным _id не найдена.'));
      } else {
        next(err);
      }
    });
};

const dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId,
    { $pull: { likes: req.user._id } },
    { new: true })
    .orFail(new Error('NotFound'))
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданны некоректные данные для постановки/снятия лайка.'));
      }
      if (err.message === 'NotFound') {
        next(new NotFoundError('Карточка с указанным id не найдена'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createCard, getCard, deleteCard, likeCard, dislikeCard,
};
