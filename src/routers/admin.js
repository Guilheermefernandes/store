const express = require('express');
const permission = require('../middleware/permission');
const passport = require('passport');
const adController = require('../controller/adController');
const routerAdmim = express.Router();

// Rotas de admim 

routerAdmim.post('/create/ad', 
    passport.authenticate('jwt', {session: false}),
    permission(2),
    adController.createdAd
);

module.exports = routerAdmim
