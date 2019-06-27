const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

mongoose.Promise = global.Promise;

if (process.env.NODE_ENV !== 'test') {
  mongoose.connect('mongodb://localhost/muber');
}

app.use(bodyParser.json());

require('./routes')(app);

app.use((error, req, res, next) => {
  res.status(422).send({ error: error.message });
});

module.exports = app;