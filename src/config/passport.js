const passport = require('passport');
const jwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');

const User = require('../models/User');

const dotenv = require('dotenv');

const opts = {};
    
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_KEY

passport.use(new jwtStrategy(opts, async function(payload, done){
    try{
        const user = await User.findOne({
            where: {
                id: payload.id
            }
        });

        if(user){
            return done(null, user);
        }else{
            return done(null, false);
        }
    }catch(error){
        console.error('Error: ', error)
    }
}));


const generateToken = (data) => {
    return jwt.sign(data, process.env.SECRET_KEY);
}

module.exports = {
    passport,
    generateToken
}