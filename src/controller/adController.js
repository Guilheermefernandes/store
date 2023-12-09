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

        res.status(201).json({
            response: true, 
            msg: 'Camisa cadastrada!' 
        });

    },
    editAd: async (req, res) => {

        const user = req.user;

        // TODO
        let { clothing_id } = req.body;
        if(clothing_id === undefined){

            res.status(404).json({
                response: false,
                msg: 'Não conseguimos indetificar o produto! Tente novamente.'
            });
            return;

        }
        if(typeof clothing_id !== 'number'){
            clothing_id = parseInt(clothing_id);
        }

        const fields = [
            'title',
            'price',
            'discount',
            'describe_part',
            'collection'
        ];

        const fieldsUpdate = {};

        for(const field of fields){
            
            if(req.body[field]){

                if(field === 'price' || field === 'discount'){
                    let value = req.body[field];

                    if(typeof value !== 'number'){
                        value = parseInt(value);
                    }

                    fieldsUpdate[field] = value; 
                    continue;
                };

                if(field === 'title'){
                    const count_txt = req.body[field].length;
                    if(count_txt > 255){

                        res.status(404).json({
                            response: false,
                            msg: 'Você excedeu o numero de caracteres! Ate 255'
                        });
                        return;

                    }

                    fieldsUpdate[field] = req.body[field];
                    continue;

                }

                if(field === 'describe_part'){
                    const count_txt = req.body[field].length;
                    if(count_txt > 1000){

                        res.status(404).json({
                            response: false,
                            msg: 'Você excedeu o numero de caracteres! Ate 1000'
                        });
                        return;

                    }

                    fieldsUpdate[field] = req.body[field];
                    continue;

                }

                fieldsUpdate[field] = req.body[field];

            }
        
        }

        try{

            const clothing = await 
                prisma.clothing_parts.findUnique({
                    where: {
                        id: clothing_id
                    }
                });
            
            if(!clothing){
                res.status(404).json({
                    response: false,
                    msg: 'Talvez esse produto não existe mais!'
                });
                return;
            }

            const rescue = await prisma.clothing_parts.findUnique({
                where: {
                    id: clothing.id
                },
            });

            for(const field of fields){
                if(fieldsUpdate[field]){
                    if(fieldsUpdate[field] === rescue[field]){
                        delete fieldsUpdate[field];
                    }
                }
            }

            if(Object.keys(fieldsUpdate).length === 0){
                res.status(200).json({
                    response: true,
                    msg: 'Esses dados possui o mesmo valor!'
                });
                return;
            }

            await prisma.clothing_parts.update({
                where: {
                    id: clothing.id
                },
                data: fieldsUpdate
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
            msg: 'Dados alterdos com sucesso!'
        });

    },
    editAdParts: async (req, res) => {

        let clothing_id = req.params.partId; //Clothing id
        let part_data = req.params.dataId; // part_data id

        if(part_data === undefined || clothing_id === undefined){

            res.status(403).json({
                response: false,
                msg: 'Dados incompletos!'
            })
            return;

        }

        if(typeof part_data !== 'number'){
            part_data = parseInt(part_data);
        }
        if(typeof clothing_id !== 'number'){
            clothing_id = parseInt(clothing_id);
        }

        const fields = [
            'color_id',
            'size_id',
            'qtd_parts'
        ];

        const updatePart = {};

        for(const field of fields){

            if(req.body[field]){

                let value;

                if(typeof req.body[field] !== 'number'){
                    value = req.body[field];

                    value = parseInt(value);
                }

                updatePart[field] = value;
                continue;
            }

        }

        try{

            const rescue = await prisma.parts_data.findUnique({
                where: {
                    id: part_data,
                    part_id: clothing_id
                }
            });

            for(const field of fields){
                if(updatePart[field]){
                    if(updatePart[field] === rescue[field]){
                        delete updatePart[field];
                    }
                }
            }

            if(Object.keys(updatePart).length === 0){
                res.status(200).json({
                    response: true,
                    msg: 'Esses dados possui o mesmo valor!'
                });
                return;
            }

            const update = await prisma.parts_data.update({
                where: {
                    id: part_data,
                    part_id: clothing_id
                },
                data: updatePart
            });

        }catch(err){
            console.log('Error: ', err);
            res.status(500).json({
                response: false,
                msg: 'Ocorreu um erro interno em nosso servidor!'
            });
            return;
        }

        res.status(200).json({
            response: true,
            msg: 'Dados alterados com sucesso!'
        });

    },
    getAd: async (req, res) => {


    },
    rating: async (req, res) => {

        const user = req.user;

        let { clothing_id, note } = req.body;

        if(clothing_id === null || 
            clothing_id === undefined || note === null || note === undefined ){

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

    },
    addComment: async (req, res) => {

        const user = req.user;

        let { product_id, message } = req.body;

        if(product_id === undefined 
            || message === undefined){

            res.status(404).json({ 
                response: false,
                msg: 'Dados incompletos!'
            });
            return;

        };

        if(typeof product_id !== 'number'){
           product_id = parseInt(product_id)
        }

        if(typeof message !== 'string'){
            res.status(404).json({
                response: false,
                msg: 'Dados de entrada icorretos'
            });
            return;
        }

        try{

            const comments = await prisma.comments.findMany({
                where: {
                    user_id: user.id
                }
            });

            for(let i=0;i<comments.length;i++){

                if(comments[i].clothing_id === product_id){
                    res.status(422).json({
                        response: false,
                        msg: 'Você já avaliou esse produto!'
                    });
                    return;
                }

            }

            const dataComments = {
                user_id: user.id,
                clothing_id: product_id,
                comment: message
            }

            await prisma.comments.create({
                data: dataComments
            });

        }catch(err){
            console.log('Error: ', err)
            res.status(500).json({
                response: false,
                msg: 'Ocorreu um erro interno em nosso servidor! Tente novamente.'
            });
            return;
        }

        res.status(500).json({
            response: true, 
            msg: 'Comentário eviado com sucesso!' 
        });

    },
    deletePart: async (req, res) => {

        let clothing_id = req.params.partId;

        if(!clothing_id){
            res.status(403).json({
                response: false,
                msg: 'Dados incompletos!'
            });
            return;
        }

        if(typeof clothing_id !== 'number'){
            clothing_id = parseInt(clothing_id);
        }

        try{
            
            await prisma.parts_data.deleteMany({
                where: {
                    part_id: clothing_id
                }
            });

            await prisma.rating.deleteMany({
                where: {
                    clothing_id: clothing_id
                }
            });

            await prisma.comments.deleteMany({
                where: {
                    clothing_id: clothing_id
                }
            });
            
            await prisma.shopping_cart.deleteMany({
                where: {
                    clothing_id: clothing_id
                }
            });

            await prisma.clothing_parts.deleteMany({
                where: {
                    id: clothing_id
                }
            });

        }catch(err){
            console.log('Error: ', err);
        }

        res.status(200).json({
            response: true,
            msg: 'Peça deletada do sistema!'
        });

    },
    addCart: async (req, res) => {

        const user = req.user;

        let {
            clothing_id,
            color_id,
            size_id,
            qtd
        } = req.body;
    
        if(clothing_id === undefined || color_id === undefined 
            || size_id === undefined || qtd === undefined ){

            res.status(404).json({
                response: false,
                msg: 'Nem todos/ ou todos os dados não foram definidos! '
            });
            return;

        }

        if(typeof clothing_id !== 'number' || typeof color_id !== 'number'
            || typeof size_id !== 'number' || typeof qtd !== 'number' ){

            clothing_id = parseInt(clothing_id);
            color_id = parseInt(color_id);
            size_id = parseInt(size_id);
            qtd = parseInt(qtd);

        }

        try{

            const clothing = await prisma.clothing_parts.findUnique({
                where: {
                    id: clothing_id
                }
            });

            if(!clothing){
                res.status(404).json({
                    response: false,
                    msg: 'Produto não econtrado! Tente novamente.'
                });
                return;
            }

            const clothing_verification = await 
                prisma.parts_data.findFirst({
                    where: {
                        part_id: clothing.id,
                        color_id: color_id,
                        size_id: size_id
                    }
                });

            if(clothing_verification.qtd_parts === 0 
                || clothing_verification.qtd_parts < qtd){

                res.status(404).json({
                    response: false,
                    msg: `Você pediu ${qtd} peças, temos 
                        ${clothing_verification.qtd_parts} em nosso estoque`
                });
                return;
            }

            const customerCart = await prisma.shopping_cart.findFirst({
                where: {
                    user_id: user.id,
                    clothing_id: clothing_id,
                    color_id: color_id,
                    size_id: size_id
                }
            });

            if(customerCart){
                
                if(customerCart.qtd_parts === qtd){
                    res.status(200).json({
                        response: true,
                        msg: 'Você já possui essa configuração em seu carrinho!'
                    })
                    return
                }

                const data = {
                    qtd_parts: qtd
                }

                await prisma.shopping_cart.update({
                    where: {
                        id: customerCart.id
                    },
                    data: data
                });

                res.status(200).json({
                    response: true,
                    msg: 'Atualização de configuração feita com sucesso!'
                });
                return;

            }

            const data_shopping_cart = {
                user_id: user.id,
                clothing_id: clothing.id,
                color_id: color_id,
                size_id: size_id,
                qtd_parts: qtd
            }

            await prisma.shopping_cart.create({
                data: data_shopping_cart
            });

        }catch(err){
            console.log('Error: ', err)
            res.status(500).json({
                response: false,
                msg: 'Ocorreu um erro interno em nosso servidor! Tente novamente.'
            });
            return;
        }

        res.status(200).json({
            response: true, 
            msg: 'Produto adiciondo ao carrinho!' 
        });

    },
    editCartItems: async (req, res) => {

        const user = req.user;

        const partId = parseInt(req.params.partId);

        let parts_shopping = await prisma.shopping_cart.findUnique({
            where: {
                id: partId
            }
        });

        let {
            color_id,
            size_id,
            qtd
        } = req.body;

        if(color_id && typeof color_id !== 'number'){
            color_id = parseInt(color_id);
        };

        if(size_id && typeof size_id !== 'number'){
            size_id = parseInt(size_id);
        };

        if(color_id === undefined && size_id === undefined){

            if(typeof qtd !== 'number'){
                qtd = parseInt(qtd);
            }

            const data = {
                qtd_parts: qtd 
            };

            try{

                const result = await prisma.shopping_cart.updateMany({
                    where: {
                        id: partId,
                        user_id: user.id
                    },
                    data: data
                });

            }catch(err){
                console.log('Error: ', err)
                res.status(500).json({
                    response: false,
                    msg: 'Ocorreu um erro interno! Tente novamente.'
                });
                return;
            }

            res.status(200).json({
                response: true,
                msg: 'Atualização de configuração feita com sucesso!'
            });
            return;

        }

        if(color_id && size_id === undefined){

            size_id = parts_shopping.size_id;

            const item_shopping = await prisma.shopping_cart.findFirst({
                where: {
                    color_id: color_id,
                    size_id: size_id,
                    user_id: user.id,
                    clothing_id: parts_shopping.clothing_id
                } 
            });

            if(typeof qtd !== 'number'){
                qtd = parseInt(qtd);
            }

            if(item_shopping){
                let data;
                if(qtd !== undefined){

                    data = {
                        qtd_parts: qtd
                    };

                }

                try{

                    await prisma.shopping_cart.updateMany({
                        where: {
                            id: item_shopping.id
                        },
                        data: data
                    });

                    await prisma.shopping_cart.delete({
                        where: {
                            id: parts_shopping.id
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

            }

            res.status(200).json({
                response: true,
                msg: 'Atualização de configuração feita com sucesso!'
            });
            return;

        }

        // Marcado
        if(size_id && color_id === undefined){

            color_id = parts_shopping.color_id;

            const item_shopping = await prisma.shopping_cart.findFirst({
                where: {
                    color_id: color_id,
                    size_id: size_id,
                    user_id: user.id,
                    clothing_id: parts_shopping.clothing_id
                } 
            });

            if(typeof qtd !== 'number'){
                qtd = parseInt(qtd);
            }

            if(item_shopping){
                let data;
                if(qtd !== undefined){

                    data = {
                        qtd_parts: qtd
                    };

                }

                try{

                    await prisma.shopping_cart.updateMany({
                        where: {
                            id: item_shopping.id
                        },
                        data: data
                    });

                    await prisma.shopping_cart.delete({
                        where: {
                            id: parts_shopping.id
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

            }

            res.status(200).json({
                response: true,
                msg: 'Atualização de configuração feita com sucesso!'
            });
            return;

        }


    },
    removeItemFromCart: async (req, res) => {

        const user = req.user;

        const idGivenPart = req.params.partId;

        try{

            await prisma.shopping_cart.findUnique({
                where: {
                    id: idGivenPart,
                    user_id: user.id
                }
            });

        }catch(err){
            console.log('Error: ', err);
            res.status(200).json({
                response: false,
                msg: 'Ocorreu um erro interno! Tente novamente.'
            })
        }

        res.status(200).json({
            response: true,
            msg: 'Camiseta removida!'
        })

    }

}