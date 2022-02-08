const mongoose = require('mongoose');

const { sampleUrl } = require('../config');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (v) => sampleUrl.test(v),
      message: 'ВВедите URL адрес!! в формате "http://yandex/...."',
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator: (v) => sampleUrl.test(v),
      message: 'ВВедите URL адрес!! в формате "http://yandex/...."',
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (v) => sampleUrl.test(v),
      message: 'ВВедите URL адрес!! в формате "http://yandex/...."',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEn: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
