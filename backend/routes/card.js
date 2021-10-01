// eslint-disable-next-line import/no-extraneous-dependencies
const router = require('express').Router();
const { isURL } = require('validator');
const { celebrate, Joi } = require('celebrate');

const {
  createCard, getCard, deleteCard, dislikeCard, likeCard,
} = require('../controllers/cards');

router.get('/cards', getCard);
// создание карточки
router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().custom((value) => {
      if (!isURL(value)) {
        throw new Error('Ссылка некоректная');
      }
      return value;
    }),
  }),
}), createCard);
// получение лайка карточки
router.put('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), likeCard);
// удаление карточки
router.delete('/cards/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), deleteCard);
// удаление лайка с карточки
router.delete('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), dislikeCard);

module.exports = router;
