const passport = require('passport');
const jwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const SHA256 = require('crypto-js/sha256');

const prisma = new PrismaClient();

const opts = {};
    
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_KEY

passport.use(new jwtStrategy(opts, async function(payload, done){
    
    let user;
    try{
        user = await prisma.users.findUnique({
            where: {
                id: payload.id
            }
        });
    }catch(err){
        console.log('Error: ', err);
    }

    if(!user){
        return done(null, false);
    }

    let query_token;
    try{
        query_token = await prisma.tokens.findUnique({
            where: {
                user_id: payload.id
            }
        });
    }catch(err){
        console('Error: ', err);
    }

    if(!query_token){
        return done(null, false);
    }

    const formart_data = (data) => {
        const day = data.getDate();
        const month = data.getMonth();
        const year = data.getFullYear();

        return {
            day,
            month,
            year
        };
    }

    const queryData = async (tokenData, current) => {

        if(tokenData.year == current.year 
            && tokenData.month == current.month){

            const calc = current.day - tokenData.day;
            if( calc < 7){
                return true;
            }else{

                let deleteToken;
                try{
                    deleteToken = await prisma.tokens.delete({
                        where: {
                           id: query_token.id,
                           user_id: user.id
                        }
                    });
                }catch(err){
                    console.log('Error: ', err);
                }

            }

        }
        return false;

    }

    const data_generate_token = 
        formart_data(query_token.date_created);

    const day = new Date().getDay();
    const month = new Date().getMonth();
    const year = new Date().getFullYear();

    const data_current = {
        day,
        month,
        year
    }
    
    const queryResult =  queryData(data_generate_token, data_current);

    if(!queryResult){
        return done(null, false);
    };

    const hash = SHA256(`${query_token.timestamp}${user.unique_indentifier}`).toString();

    if(query_token.security_hash === hash){
        return done(null, user);
    }else{
        return done(null, false);
    }
    
}));


const generateToken = async (data) => {

    const user = await prisma.users.findUnique({
        where: {
            id: data.id
        }
    });

    const current_timestamp = Date.now(); 
    
    const hash = SHA256(`${current_timestamp}${user.unique_indentifier}`).toString();

    data.verification = hash;

    const token = jwt.sign(data, process.env.SECRET_KEY);

    try{

        const deleteToken = await prisma.tokens.delete({
            where: {
                user_id: user.id
            }
        });

        if(deleteToken){
            await prisma.tokens.create({
                data: {
                    token: token,
                    date_created: new Date(),
                    user_id: data.id,
                    security_hash: hash,
                    timestamp: current_timestamp
                }
            });
            
            return token;
        }

        return false;

    }catch(err){
        console.log('Error: ', err);
        return false;
    }

}

module.exports = {
    passport,
    generateToken
}