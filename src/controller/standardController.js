const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = {
    colors: async (req, res) => {
        
        let colors;
        try{
            colors = await prisma.parts_color.findMany();
        }catch(err){
            console.log('Error: ', err);
            res.status(500).json({ response: false, msg: 'Tente novamente!' });
            return;
        }
        
        res.status(200).json({ response: true, colors });
    },
    size: async (req, res) => {

        let size;
        try{
            size = await prisma.parts_size.findMany();
        }catch(err){
            console.log('Error: ', err);
            res.status(500).json({ response: false, msg: 'Tente novamente!' });
            return;
        }

        res.status(200).json({ response: true, size });
    }
}