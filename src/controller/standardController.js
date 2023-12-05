const Color = require("../models/Color");
const Size = require('../models/Size')

module.exports = {
    colors: async (req, res) => {
        
        let colors;
        try{
            colors = await Color.findAll();
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
            size = await Size.findAll();
        }catch(err){
            console.log('Error: ', err);
            res.status(500).json({ response: false, msg: 'Tente novamente!' });
            return;
        }

        res.status(200).json({ response: true, size });
    }
}