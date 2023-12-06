const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = {
    createdAd: async (req, res) => {

        //availability -> [pt-br] Disponibilidade -> Object typeOf

        const fields = [
            'title',
            'price',
            'describe_part',
            'collection_id',
            'discount',
            'type_id',
            'product_line_id',
            'availability'
        ];

        let newAd = {};

        for(const field of fields){
            if(req.body[field]){

                if(field === 'price'){

                    let value = req.body[field];
                    value = parseFloat(value);

                    if(typeof value !== 'number'){
                        res.json({ 
                            response: false, 
                            msg: 'Dados incorretos!' });
                        return;
                    }
                
                    newAd.price = value;
                    continue;
                }

                if(field === 'availability'){
                    continue;
                }

                if(field === 'discount'){

                    let value = req.body[field];
                    value = parseFloat(value);

                    if(typeof value !== 'number'){
                        res.json({ 
                            response: false, 
                            msg: 'Dados incorretos!' });
                        return;
                    }

                    newAd.discount = value;
                    continue;
                }

                if(field === 'type_id' || field === 'collection_id' 
                    || field === 'product_line_id'){

                        let value = req.body[field];
                        if(typeof value !== 'number'){
                            value = parseInt(value); 
                        }

                        newAd[field] = value;
                        continue;

                }

                newAd[field] = req.body[field];
            }
        }

        newAd.date_created = new Date();

        let clothing;
        try{
            clothing = await prisma.clothing_parts.create({
                data: newAd
            });
        }catch(err){
            console.log('Error: ', err);
            console.log('Error: ', err);
            res.status(500).json({ 
                response: false, 
                msg: 'Ocorreu um erro interno! Tente novamente.'});
            return;
        }

        if(req.body.availability){
                    
            const objectDataTshirt = JSON.parse(req.body.availability);
            for(let i in objectDataTshirt){
                const addReferencesTshirt = {};

                let valueColor = objectDataTshirt[i].color;
                let valueSize = objectDataTshirt[i].size;
                let valueQtd = objectDataTshirt[i].qtd;

                if(typeof valueColor !== 'number' 
                    || typeof valueSize !== 'number' || typeof valueQtd !== 'number'){
                    
                        valueColor = parseInt(objectDataTshirt[i].color);
                        valueSize = parseInt(objectDataTshirt[i].size);
                        valueQtd = parseInt(objectDataTshirt[i].qtd);

                }

                if(isNaN(valueColor) || isNaN(valueSize) || isNaN(valueQtd)){
                    res.status(400).json({ 
                        response: false,
                        msg: 'Ocorreu um erro interno! Tente novamente.'
                    });

                    await prisma.clothing_parts.delete({
                        where: {
                            id: clothing.id
                        }
                    });

                    return;

                }

                addReferencesTshirt.color_id = valueColor;
                addReferencesTshirt.size_id = valueSize;
                addReferencesTshirt.part_id = clothing.id;
                addReferencesTshirt.qtd_parts = valueQtd;

                try{
                    const saveDataTshirt = 
                        await prisma.parts_data.create({
                            data: addReferencesTshirt
                        });
                }catch(err){

                    await prisma.tshirt.delete({
                        where: {
                            id: clothing.id
                        }
                    });

                    console.log('Error: ', err);
                    res.status(500).json({ response: false, msg: 'Ocorreu um erro interno! Tente novamente.'});
                    return;
                }   
            }
        }

        res.status(201).json({ response: true, msg: 'Camisa cadastrada!' });

    },
    getAd: async (req, res) => {


    },
    rating: async (req, res) => {

        const user = req.user;

        let { clothing_id, note } = req.body;

        if(clothing_id === null || 
            clothing_id === undefined || note == null || note === undefined ){

            res.status(404).json({
                response: false,
                msg: 'Dados incompletos! Tente novamente'
            });
            return;

        }

        if(typeof note !== 'number' 
            || typeof clothing_id !== 'number'){
                
            note = parseInt(note);
            clothing_id = parseInt(clothing_id);
        
        };

        try{

            const rating = await prisma.rating.findMany({
                where: {
                    user_id: user.id
                }
            });

            for(let i=0;i<rating.length;i++){

                if(rating[i].clothing_id === clothing_id){
                    res.status(422).json({
                        response: false,
                        msg: 'Você já avaliou esse produto!'
                    });
                    return;
                }

            }

            const createdRating = {
                clothing_id,
                user_id: user.id,
                note
            }

            await prisma.rating.create({
                data: createdRating
            });

        }catch(err){
            console.log('Error: ', err);
            res.status(500).json({
                response: false,
                msg: 'Ocorreu um erro interno em nosso servidor! Tente novamente.'
            });
            return;
        }

        res.status(200).json({
            response: true,
            msg: 'Sua avaliação foi enviada com sucesso!'
        });

    }

}