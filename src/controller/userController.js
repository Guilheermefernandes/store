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

    }
}