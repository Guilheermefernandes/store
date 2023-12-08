const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

module.exports = {
    getUser: async (req, res) => {
        
        if(req.user == undefined || req.user === null){
            res.status(404).json({ response: false, msg: 'Ocorreu um erro interno!'});
            return;
        }

        const data = req.user;
    
        const user = {
            name: data.name,
            lastName: data.lastName,
            email: data.email,
            state: data.state,
            city: data.city,
            neighborhood: data.neighborhood,
            street: data.street,
            number: data.number
        }

        res.status(200).json({ user }); 

    },
    editUser: async (req, res) => {

        const user = req.user;

        if(user === undefined || user === null){
            res.status(404).json({ 
                response: false, 
                msg: 'Ocorreu um erro! Tente novamente.'});
            return;
        }

        const fields = [
            'name',
            'lastName',
            'password',
            'state',
            'city',
            'neighborhood',
            'street',
            'number'
        ]

        const dataToUpdate = {};

        for(const field of fields){
            if(req.body[field]){
                
                if(field === 'password'){

                    let data = req.body[field];
                    data = JSON.parse(data);
                    if(typeof data !== 'object'){
                        res.status(401).json({
                            response: false,
                            msg: 'Ocorreu um erro! Tente novamente.'
                        });
                        return;
                    }

                    if(!data.currentPassword || !data.newPassword){
                        res.status(401).json({
                            response: false,
                            msg: 'Dados incompletos para alteração! Preencha novamente e tente de novo.'
                        });
                        return;
                    }

                    const confirmPassword = await bcrypt.compare(data.currentPassword, user.password);
                    if(!confirmPassword){
                        res.status(401).json({
                            response: false,
                            msg: 'Unauthorized!'
                        });
                        return;
                    }

                    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/;
                    if(!regex.test(data.newPassword)){
                    
                        res.status(400).json({
                            response: false,
                            msg: 'Senha inválida!'
                        });
                        return;
                    
                    }

                    const hash = await bcrypt.hash(data.newPassword, 10);

                    dataToUpdate[field] = hash;
                    continue;
                }

                dataToUpdate[field] = req.body[field];

            }
        }

        try{
            await prisma.users.update({
                where: {
                    id: user.id
                },
                data: dataToUpdate
            });
        }catch(err){
            console.log('Error: ', err);
            res.status(500).json({ 
                response: false,
                msg: 'Ocorreu um erro interno! Tente novamente.'
            });
            return;
        }

        res.status(200).json({ 
            response: true,
            msg: 'Atualização feita com suscesso!'
        });

    },
    deleteUser: async (req, res) => {

        const user = req.user;

        try{

            const deleteUser = await prisma.users.delete({
                where: {
                    id: user.id
                }
            });

        }catch(err){
            console.log('Error: ', err);
            res.status(500).json({
                response: false,
                msg: 'Ocorreu um erro interno! Tente novamente.'
            });
            return;
        }

        res.status(200).json({
            response: true,
            msg: 'Usuário deletado!'
        });

    }
}