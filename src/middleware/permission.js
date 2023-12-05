const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const permission = (nPermission) => {
    return async (req, res, next) => {
        const { authorization } = req.headers;
        const divider = authorization.split(' ');
        const token = divider[1];
        const data = jwt.verify(token, process.env.SECRET_KEY);

        let user;
        try{

            user = await prisma.users.findUnique({
                where: {
                    id: data.id
                }
            });

        }catch(err){
            console.log('Error: ', err);
            res.status(500)
                .json({ 
                    response: false,
                    msg: 'Ocorreu um erro interno do servidor! Tente novamente'
                });
        }

        if(user === null){
            res.status(404).json({ 
                response: false, 
                msg: 'Ocorreu um erro! Tente novamente.' 
            });
            return;
        }

        if(user.permission >= nPermission){
            next();
        }else{
            res.status(401).json({ 
                response: false, 
                msg: 'Unauthorized' 
            });
            return;
        }
    }
}

module.exports = permission;