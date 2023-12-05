const express = require('express');
const permission = require('../middleware/permission');
const passport = require('passport');
const standardController = require('../controller/standardController');

const standard = express.Router();

standard.get('/colors',
    passport.authenticate('jwt', {session: false}),
    permission(1),
    standardController.colors
);

standard.get('/size', 
    passport.authenticate('jwt', {session: false}),
    standardController.size
);

module.exports = standard;