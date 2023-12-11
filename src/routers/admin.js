const express = require('express');
const permission = require('../middleware/permission');
const passport = require('passport');
const adController = require('../controller/adController');
const routerAdmim = express.Router();
const uploadMulter = require('../middleware/multer');

// Rotas de ad 

routerAdmim.post('/create/ad', 
    passport.authenticate('jwt', {session: false}),
    permission(2),
    uploadMulter.array('images', 2),
    adController.createdAd,
);
routerAdmim.put('/ad/edit',
    passport.authenticate('jwt', {session: false}),
    permission(2),
    adController.editAd
);
routerAdmim.put('/ad/:partId/:dataId', 
    passport.authenticate('jwt', {session: false}),
    permission(2),
    adController.editAdParts
);
routerAdmim.delete('/ad/:partId/delete',
    passport.authenticate('jwt', {session: false}),
    permission(2),
    adController.deletePart
);

module.exports = routerAdmim
