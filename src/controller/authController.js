const validator = require('validator');
const { PrismaClient, Prisma } = require('@prisma/client');
const bcrypt = require('bcrypt');
const { generateToken } = require('../config/passport');
const { v4: uuidv4 } = require('uuid')

const prisma = new PrismaClient();

module.exports = {
    signin: async (req, res) => {

        const { email, password } = req.body;

        const msg = 'Email/e ou senha inválidos!';

        if(!validator.isEmail(email)){
            res.json(401).json({ response: false, msg});
            return;
        }

        if(password){
            const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/;
            if(!regex.test(password)){
                res.status(404).json({ response: false, msg});
                return;
            }
        }

        let user;
        try{
            user = await prisma.users.findUnique({
                where: {
                    email: email
                }
            });
        }catch(error){
            // TODO
        }

        if(user === null){
            res.status(404).json({ response: false, msg, teste: 1 });
            return;
        }

        const compare = await bcrypt.compare(password, user.password);
        if(!compare){
            res.status(404).json({ response: false, msg});
            return;
        }

        const data = {
            id: user.id
        }

        const token = await generateToken(data);
        if(!token){
            console.log('Error: ', error);
            res.status(500).json({
                response: false,
                msg: 'Ocorreu um erro interno! Tente novamente.'});
            return;
        }

        res.status(200).json({ response: true, token});
    },
    signup: async (req, res) => {

        const fields = [
            'name',
            'lastName',
            'email',
            'password',
            'state',
            'city',
            'neighborhood',
            'street',
            'number'
        ]

        const user = {}
        user.permission = 1;
        user.unique_indentifier = uuidv4();

        for(const field of fields){
            if(req.body[field]){

                if(field === 'email'){

                    let searchUserDB;
                    try{

                        const email = req.body[field];

                        searchUserDB = await prisma.users.findUnique({
                            where: {
                                email: email
                            }
                        });
                    }catch(error){
                        //TODO
                    }

                    if(searchUserDB){
                        res.status(400).json({ response: false, msg: 'Esse email já existe em nosso sistema!' });
                        return;
                    }

                    user.email = req.body[field];
                    continue;
                }

                if(field === 'password'){
                    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/;
                    if(!regex.test(req.body[field])){
                        res.status(400).json({ response: false, msg: 'Senha inválida!' });
                        return;
                    }

                    let hash;
                    try{
                        hash = await bcrypt.hash(req.body[field], 10);
                    }catch(error){
                        //TODO
                    }

                    user.password = hash;
                    continue;
                }

                if(field === 'number'){
                    user.number = parseInt(req.body[field])
                    continue;
                }

                user[field] = req.body[field];

            }
        }

        try{
            const createdUser = await prisma.users.create({
                data: user
            });
        }catch(error){
            console.log('Error: ', error);
            res.status(500).json({ response: false, msg: 'Ocorreu um erro interno! Tente novamente.'});
            return;
        }

        res.status(201).json({response: true, msg: 'Usuário criado!'});

    }
}