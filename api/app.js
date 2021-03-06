'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');
const bodyparser = require('body-parser');
const { sequelize } = require('./models');
const cors = require('cors');

const usersRoute = require('./routes/users');
const coursesRoute = require('./routes/courses');

sequelize.authenticate()
  .then(() => {
    console.log('Connection to the database has been established...');
    return sequelize.sync();
  })
  .catch(err => console.error('error'));

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();

// Enable all CORS requests
app.use(cors());

// setup morgan which gives us http request logging
app.use(morgan('dev'));

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

// TODO setup your api routes here
app.use('/api/courses', coursesRoute);
app.use('/api/users', usersRoute);

// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});