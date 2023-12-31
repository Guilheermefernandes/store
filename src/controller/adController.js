const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = {
    createdAd: async (req, res) => {

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
                msg: 'Ocorreu um erro ao registar a camiseta! Tente novamente.'});
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
                        msg: 'Ocorreu um erro ao configurar a cor e tamanho da peça! Tente novamente.'
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
                    res.status(500).json({ response: false, msg: 'Ocorreu um erro ao configurar a cor e tamanho da peça! Tente novamente.'});
                    return;
                }   
            }
        }

        const archives = req.files
        const dataImg = [];
        for(let i=0;i<archives.length;i++){
            if(['image/jpg', 'image/jpeg', 'image/png'].includes(archives[i].mimetype)){
                dataImg.push({
                    image_name: archives[i].filename,
                    clothing_id: clothing.id 
                });
            }
        }
        if(dataImg.length > 0){

            try{

                await prisma.images_clothing.createMany({
                    data: dataImg
                });
    
            }catch(err){
                console.log('Error: ', err);
                res.status(500).json({
                    response: false, 
                    msg: 'Ocorreu um erro ao configurar a cor e tamanho da peça! Tente novamente.'});
                return;
            }

        }    

        res.status(201).json({
            response: true,
            clothing: clothing.id,
            msg: 'Camisa cadastrada!' 
        });

    },
    sendImages: async (req, res) => {

        let clothing = req.params.partId;

        if(clothing === undefined || clothing === null){
            res.status(400).json({
                response: false,
                msg: 'Dados incompletos'
            });
            return;
        };

        if(typeof clothing !== 'number'){
            clothing = parseInt(clothing);
        }

        let clothingImages;
        try{

            clothingImages = await prisma.images_clothing.findMany({
                where: {
                    clothing_id: clothing
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

        if(clothingImages.length === 4){
            // TODO
            res.json({
                response: false,
                msg: 'Você já atingiu o limite de imagens por peça!'
            });
            return;
        }

        const imgs = req.files;
        const dataImg = [];
        for(let i=0;i<imgs.length;i++){
            dataImg.push({
                image_name: imgs[i].filename,
                clothing_id: clothing
            });
        };

        const count = 4 - clothingImages.length;
        if(dataImg.length > count){
            // TODO
            res.json({
                response: false,
                msg: `Você só pode enviar ${4 - clothingImages.length} imagens!`
            });
            return;
        }

        if(dataImg.length > 0){
            
            try{

                await prisma.images_clothing.createMany({
                    data: dataImg
                });

            }catch(err){
                console.log('Error: ', err);
                res.status(500).json({
                    response: false,
                    msg: 'Ocorreu um erro ao salvar as imagens! Tente novamente.'
                });
                return;
            }

        }else{
            res.status(403).json({
                response: false,
                msg: 'Não há imagens para salvar!'
            });
            return;
        }

        res.status(200).json({
            response: true,
            msg: 'Imagens salvas com sucesso!'
        });

    },
    deleteImage: async (req, res) => {

        let imgId = req.params.imageId;

        if(imgId === undefined || imgId === null){
            res.status(400).json({
                response: false,
                msg: 'Dados incompletos'
            });
            return;
        }

        if(typeof imgId !== 'number'){
            imgId = parseInt(imgId);
        }

        let img;
        try{

            img = await prisma.images_clothing.findUnique({
                where: {
                    id: imgId
                }
            });

        }catch(err){
            console.log('Error: ', err);
            res.status(500).json({
                response: false,
                msg: 'Ocorreu um erro interno ao localizar a peça! Tente novamente.'
            });
            return;
        }

        if(img){
            try{

                await prisma.images_clothing.delete({
                    where: {
                        id: img.id
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
                response: false,
                msg: 'Imagem deletada!'
            });
            return;
        }

        res.status(204).json({
            response: false,
            msg: 'Imagem não encontrada!'
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
    listAds: async (req, res) => {

        //Pagina desejada
        const { page = 1 } = req.query;

        // Limite de resultados por página
        const limit = 10;

        // Ultima página 
        let lastPage = 1;
        
        let countAd;
        try{

            //obter a quantidade de registros no db
            countAd = await prisma.clothing_parts.count({});
            
        }catch(err){
            console.log('Error: ', err);
            res.status(500).json({
                response: false,
                msg: 'Ocorreu um erro interno! Tente novamente.'
            });
            return;
        }

        if(countAd !== 0){

            // Descobrir qual a ultima página, ex: 31 / 10 -> 3.1 (M.c) -> 4
            lastPage = Math.ceil(countAd / limit);

        }else{
            res.status(500).json({
                response: false,
                msg: 'Nnenum registro encontrado!'
            });
            return;
        }

        let result;
        try{

            // Realizando consulta usando skip e take
            result = await prisma.clothing_parts.findMany({
                skip: (page * limit) - limit,
                take: limit
            });

        }catch(err){
            console.log('Error: ', err);
            res.status(500).json({
                response: false,
                msg: 'Ocorreu um erro interno ao resgatar os anuncios! Tente novamente.'
            });
            return;
        }

        // Possivél analise
        if(result.length !== 0){

            for(let i=0;i<result.length;i++){

                try{

                    const listrating = await prisma.rating.findMany({
                        where: {
                            clothing_id: result[i].id
                        }
                    });

                    if(listrating.length !== 0){
                        let count = 0;
                        for(let j=0;j<listrating.length;j++){
                            count += listrating[j].note;
                        }
                    
                        const calc = count / listrating.length

                        result[i].note = calc;

                    }else{
                        result[i].note = 0;
                    }                    
                    

                }catch(err){
                    console.log('Error: ', err);
                    res.status(500).json({
                        response: false,
                        msg: 'Ocorreu um erro interno! Tente novamente.'
                    });
                    return;
                }

                // Part data
                try{

                    const parts_data = await prisma.parts_data.findMany({
                        where: {
                            part_id: result[i].id,
                        }
                    });
                    
                    let resultPartsData = [];
                    for(let j=0;j<parts_data.length;j++){

                        const color = await prisma.parts_color.findUnique({
                            where: {
                                id: parts_data[j].color_id
                            }
                        });

                       const size = await prisma.parts_size.findUnique({
                            where: {
                                id: parts_data[j].size_id
                            }
                        });

                        resultPartsData.push({
                            qtd: parts_data[j].qtd_parts,
                            color: color.name_color,
                            size: size.size
                        });


                        result[i].data = resultPartsData;
                    }

                }catch(err){
                    console.log('Error: ', err);
                    res.status(500).json({
                        response: false,
                        msg: 'Ocorreu um erro interno! Tente novamente.'
                    });
                    return;
                }

                // Comments and Evaluations
                try{

                    const comments = await prisma.comments.findMany({
                        where: {
                            clothing_id: result[i].id
                        },
                        skip: 0,
                        take: 10
                    });

                    const resultComments =  [];
                    for(let j=0;j<comments.length;j++){

                        const user = await prisma.users.findUnique({
                            where: {
                                id: comments[j].user_id
                            }
                        });

                        let rating = await prisma.rating.findFirst({
                            where: {
                                clothing_id: result[i].id,
                                user_id: user.id
                            }
                        });

                       if(rating === null){
                            rating = -1; 
                       }

                        resultComments.push({
                            user_name: `${user.name} ${user.lastName}`,
                            email: `${user.email}`,
                            rating: rating.note,
                            comment: comments[j].comment
                        });

                        result[i].comments = resultComments;

                    }

                }catch(err){
                    console.log('Error: ', err);
                    res.status(500).json({
                        response: false,
                        msg: 'Ocorreu um erro interno! Tente novamente.'
                    });
                    return;
                }

                // Clothing Images
                try{ 

                    const images = await prisma.images_clothing.findMany({
                        where: {
                            clothing_id: result[i].id
                        }
                    });

                    for(let j=0;j<images.length;j++){
                        delete images[j].id;
                        delete images[j].clothing_id;
                    }

                    result[i].clothingImages = images;

                }catch(err){
                    console.log('Error: ', err);
                    res.status(500).json({
                        response: false,
                        msg: 'Ocorreu um erro interno! Tente novamente.'
                    });
                    return;
                }

            }

        }

        res.status(200).json({
            response: true,
            result
        })

    },
    getAd: async (req, res) => {

        let { product } = req.query;

        if(product === undefined || product === null){
            res.status(404).json({
                response: false,
                msg: 'Dados incompletos!'
            });
            return;
        }

        if(typeof product !==  'number'){
            product = parseInt(product);
        }

        let result;
        try{

            result = await prisma.clothing_parts.findUnique({
            where: {
                id: product
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

        const total = result.price * result.discount;
        const finalPrice = result.price - (total / 100);

        result.price = finalPrice;

        delete result.date_created;

        if(typeof result.collection_id === 'number'){
            try{

                const collection = await prisma.collection.findUnique({
                    where: {
                        id: result.collection_id
                    }
                });

                result.collection = collection.name;
                result.describe_collection = collection.describe;
                if(collection.background){
                    result.collection_background = collection.background;
                }
                delete result.collection_id;

            }catch(err){
                console.log('Error: ', err);
                res.status(500).json({
                    response: false,
                    msg: 'Ocorreu um erro interno! Tente novamente.'
                });
                return;
            }
        }else{
            delete result.collection_id;
        }

        try{

            const product_line = await prisma.product_line.findUnique({
                where: {
                    id: result.product_line_id
                }
            });

            result.line = product_line.name;
            delete result.product_line_id

        }catch(err){
            console.log('Error: ', err);
            res.status(500).json({
                response: false,
                msg: 'Ocorreu um erro interno! Tente novamente.'
            });
            return;
        }

        try{

            const type_clothing = await prisma.types.findUnique({
                where: {
                    id: result.type_id
                }
            });

            result.type = type_clothing.name;
            delete result.type_id;

        }catch(err){
            console.log('Error: ', err);
            res.status(500).json({
                response: false,
                msg: 'Ocorreu um erro interno! Tente novamente.'
            });
            return;
        }

        try{

            const rating = await prisma.rating.findMany({
                where: {
                    clothing_id: product
                }
            });

            if(rating.length !== 0){
                let count = 0;  
                for(let i=0;i<rating.length;i++){
                    count+= rating[i].note;
                }

                result.note = count / rating.length;
            }else{
                result.note = 0;
            }


        }catch(err){
            console.log('Error: ', err);
            res.status(500).json({
                response: false,
                msg: 'Ocorreu um erro interno! Tente novamente.'
            });
            return;
        }

        try{

            let resultPartData = await prisma.parts_data.findMany({
                where: {
                    part_id: result.id
                }
            });

            const partsData = [];
            for(let i=0;i<resultPartData.length;i++){

                const color = await prisma.parts_color.findUnique({
                    where: {
                        id: resultPartData[i].color_id
                    }
                });

                const size = await prisma.parts_size.findUnique({
                    where: {
                        id: resultPartData[i].size_id
                    }
                });

                partsData.push({
                    qtd: resultPartData[i].qtd_parts,
                    color: {
                        name_color: color.name_color,
                        hexa_decimal: color.hexa_decimal,
                        id: color.id
                    },
                    size: {
                        size: size.size,
                        id: size.id
                    }
                });

            }

            result.data = partsData;

        }catch(err){
            console.log('Error: ', err);
            res.status(500).json({
                response: false,
                msg: 'Ocorreu um erro interno!'
            });
            return;
        }

        try{

            const comments = await prisma.comments.findMany({
                where: {
                    clothing_id: product
                },
                skip: 0,
                take: 10
            });

            const dataComments = []
            for(let i=0;i<comments.length;i++){
                
                const user = await prisma.users.findUnique({
                    where: {
                        id: comments[i].user_id
                    }
                });

                const userRating = await prisma.rating.findFirst({
                    where: {
                        user_id: user.id,
                        clothing_id: result.id
                    }
                });

                let note;
                if(userRating !== null){
                    note = userRating.note
                }else{
                    note = 0
                }

                dataComments.push({
                    user_name: `${user.name} ${user.lastName}`,
                    user_email: user.email,
                    rating: note,
                    comment: comments[i].comment
                });

            }

            result.comments = dataComments;

        }catch(err){
            console.log('Error: ', err);
            res.status(500).json({
                response: false,
                msg: 'Ocorreu um erro interno! Tente novamente.'
            });
            return;
        }

        try{

            const images = await prisma.images_clothing.findMany({
                where: {
                    clothing_id: product
                }
            });

            for(let i=0;i<images.length;i++){
                delete images[i].id
                delete images[i].clothing_id
            }

            result.images = images;

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
            result,
        });

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

    }

}