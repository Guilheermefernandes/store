const express = require('express');
const router = require('./src/routers/router');
const routerAdmim = require('./src/routers/admin');
const standard = require('./src/routers/standard');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const { passport } = require('./src/config/passport');

dotenv.config();

const app = express();

app.use(passport.initialize());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', router);
app.use('/api', routerAdmim);
app.use('/api', standard);

module.exports = app;