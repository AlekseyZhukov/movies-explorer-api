const express = require('express');
const { celebrate, Joi, errors } = require('celebrate');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routesUsers = require('./routes/users');

const routesMovies = require('./routes/movies');

const { requestLogger, errorLogger } = require('./midlewares/Logger');

const { PORT = 3000 } = process.env;
const app = express();
const { auth } = require('./midlewares/auth');
const { postUser, login } = require('./controllers/users');

const NotFoundError = require('./errors/NotFoundError');

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
});
app.use(bodyParser.json());
app.get('api/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.post(
  '/api/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
      name: Joi.string().min(2).max(30),
    }),
  }),
  postUser,
);
app.post(
  '/api/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  login,
);
app.use(auth);
app.use('/api/users', routesUsers);
app.use('/api/movies', routesMovies);
app.use('*', () => {
  throw new NotFoundError('Запрашиваемая страница не существует!');
});
app.use(errorLogger);
app.use(errors());

app.use(requestLogger);
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : `${message}`,
    });
  next();
});
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
