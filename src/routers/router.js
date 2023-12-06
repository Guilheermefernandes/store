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
router.post('/me/user/edit', 
    passport.authenticate('jwt', {session: false}),
    permission(1),
    userController.editUser
);

router.get('/ads/all',
    adController.getAd
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

module.exports = router;