const express = require('express');

const router = express.Router();
const userController = require('../controller/userController');
const authController = require('../controller/authController');
const passport = require('passport');
const adController = require('../controller/adController');
const permission = require('../middleware/permission');

router.post('/signin', authController.signin);
router.post('/signup', authController.signup);

router.get('/me/user', 
    passport.authenticate('jwt', {session: false}),
    permission(1),
    userController.getUser
);
router.put('/me/user/edit', 
    passport.authenticate('jwt', {session: false}),
    permission(1),
    userController.editUser
);

// ADS

router.get('/ads/all',
    adController.getAd
);
router.put('/ad/edit',
    passport.authenticate('jwt', {session: false}),
    permission(2),
    adController.editAd
);
router.put('/ad/:partId/:dataId', 
    passport.authenticate('jwt', {session: false}),
    permission(2),
    adController.editAdParts
);




// Rating and Comments

router.post('/ad/rating',
    passport.authenticate('jwt', {session: false}),
    permission(1),
    adController.rating
);
router.post('/ad/comment', 
    passport.authenticate('jwt', {session: false}),
    permission(1),
    adController.addComment
);

// Shopping Cart
router.post('/add/cart/product',
    passport.authenticate('jwt', {session: false}),
    permission(1),
    adController.addCart
);

module.exports = router;