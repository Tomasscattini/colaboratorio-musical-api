require('dotenv').config();

const bodyParser = require('body-parser');
// const cookieParser = require('cookie-parser');
const express = require('express');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');
const cors = require('cors');
// const passport = require('./config/passport');

const DBConnection = process.env.DB_ADDRESS || 'mongodb://localhost/colaboratorio-musical';

mongoose
    .connect(DBConnection, { useNewUrlParser: true })
    .then((x) => {
        console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
    })
    .catch((err) => {
        console.error('Error connecting to mongo', err);
    });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());

// Static files

app.use(express.static(path.join(__dirname, 'public/build')));

// default value for title local
app.locals.title = 'Tierra Roja';

require('./config/session')(app);

app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true
    })
);

const index = require('./routes/index');
app.use('/', index);

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const authorRoutes = require('./routes/author');
app.use('/api/author', authorRoutes);

const projectRoutes = require('./routes/project');
app.use('/api/project', projectRoutes);

module.exports = app;
