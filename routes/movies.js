const router = require('express').Router();

const { celebrate, Joi } = require('celebrate');

const { sampleUrl } = require('../config');

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/', getMovies);

router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.number().required(),
      description: Joi.string().required(),
      image: Joi.string().pattern(sampleUrl).required(),
      trailer: Joi.string().pattern(sampleUrl).required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
      thumbnail: Joi.string().pattern(sampleUrl).required(),
    }),
  }),
  createMovie,
);

router.delete(
  '/:_id',
  celebrate({
    params: Joi.object().keys({
      _id: Joi.string().required().length(24).hex(),
    }),
  }),
  deleteMovie,
);

module.exports = router;
