const Movie = require('../models/movie');

const CastError = require('../errors/CastError');

const ForbiddenError = require('../errors/ForbiddenError');

const NotFoundError = require('../errors/NotFoundError');

const ValidationError = require('../errors/ValidationError');

const getMovies = (req, res, next) => {
  Movie.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch(next);
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const owner = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные'));
      }
      next(err);
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params._id)
    .orFail(() => {
      throw new NotFoundError('Нет фильма с таким id!');
    })
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        throw new ForbiddenError('Нельзя удалять чужие фильмы!');
      } else {
        Movie.findByIdAndRemove(req.params._id)
          .then((data) => res
            .status(200)
            .send({ data, message: 'Фильм успешно удален!' }))
          .catch(next);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('Невалидный id карточки'));
      }
      next(err);
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
