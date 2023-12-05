const validator = require('validator');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { generateToken } = require('../config/passport');


module.exports = {
    signin: async (req, res) => {

        const { email, password } = req.body;

        const msg = 'Email/e ou senha inválidos!';

        if(!validator.isEmail(email)){
            res.json(401).json({ response: false, msg });
            return;
        }

        if(password){
            const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/;
            if(!regex.test(password)){
                res.status(404).json({ response: false, msg });
                return;
            }
        }

        let user;
        try{
            user = await User.findOne({
                where: {
                    email: email
                }
            });
        }catch(error){
            // Criar log no sistema
        }

        if(user === null){
            res.status(404).json({ response: false, msg});
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

        const token = generateToken(data);

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

        for(const field of fields){
            if(req.body[field]){

                if(field === 'email'){

                    let searchUserDB;
                    try{

                        const email = req.body[field];

                        searchUserDB = await User.findOne({
                            where: {
                                email: email
                            }
                        });
                    }catch(error){
                        //TODO
                    }

                    console.log(searchUserDB);

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

                user[field] = req.body[field];

            }
        }

        try{
            const createdUser = User.build(user);
            await createdUser.save();
        }catch(error){
            console.log('Error: ', error);
            res.status(500).json({ response: false, msg: 'Ocorreu um erro interno! Tente novamente.'});
            return;
        }

        res.status(201).json({response: true, msg: 'Usuário criado!'});

    }
}