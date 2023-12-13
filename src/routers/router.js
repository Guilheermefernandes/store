const express = require('express');

const router = express.Router();
const userController = require('../controller/userController');
const authController = require('../controller/authController');
const passport = require('passport');
const adController = require('../controller/adController');
const permission = require('../middleware/permission');
const cartController = require('../controller/cartController');

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
    adController.listAds
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
    cartController.addCart
);
router.put('/update/:partId',
    passport.authenticate('jwt', {session: false}),
    permission(1),
    cartController.editCartItems

);
router.delete('/cart/:partId/delete',
    passport.authenticate('jwt', {session: false}),
    permission(1),
    cartController.removeItemFromCart
);

module.exports = router;