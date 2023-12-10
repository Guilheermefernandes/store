const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = {
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
    myCart: async (req, res) => {

        const user = req.user;

        let cart;
        try{

            cart = await prisma.shopping_cart.findMany({
                where: {
                    user_id: user.id
                }
            });

        }catch(err){
            console.log('Error: ', err);
            res.status(500).json({
                response: false,
                msg: 'Houve um erro! Tente novamente.'
            });
            return;
        }


        let data = {};
        for(let i=0;i<cart.length;i++){

            // TODO

        }

        res.status(200).json({
            response: true,
            data
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

        if(parts_shopping === null){
            res.status(404).json({
                response: false,
                msg: 'Houve uma falha! Tente novamente.'
            });
            return;
        }

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

            let item_shopping;
            try{

                item_shopping = await prisma.shopping_cart.findFirst({
                    where: {
                        color_id: color_id,
                        size_id: size_id,
                        user_id: user.id,
                        clothing_id: parts_shopping.clothing_id
                    } 
                });

            }catch(err){
                console.log('Error: ', err);
                res.status(500).json({
                    response: false,
                    msg: 'Ocorreu um erro interno! tente novamente.'
                });
                return;
            }

            if(item_shopping){
                let data = {};
                if(qtd){

                    if(typeof qtd !== 'number'){
                        qtd = parseInt(qtd);
                    }

                    let retrievePartData;
                    try{

                        retrievePartData = await prisma.parts_data.findMany({
                            where: {
                                part_id: item_shopping.clothing_id,
                                color_id: item_shopping.color_id,
                                size_id: item_shopping.size_id
                            }
                        });

                    }catch(err){
                        console.log('Error: ', err);
                        res.status(500).json({
                            response: false,
                            msg: 'Ocorreu um erro! Tente novamente.'
                        })
                    }

                    if(qtd < retrievePartData.qtd_parts){
                        data = {
                            qtd_parts: qtd
                        };
                    }else{
                        res.status(404).json({
                            response: false,
                            msg: 'Quantidade de pedido excedido!'
                        });
                        return;
                    }

                }

                
                data.color_id = color_id;

                try{

                    if(!data){
                        await prisma.shopping_cart.updateMany({
                            where: {
                                id: item_shopping.id
                            },
                            data: data
                        });
                    }

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

            }else{
                try{

                    let data = {
                        color_id: color_id
                    };

                    await prisma.shopping_cart.updateMany({
                        where: {
                           id: parts_shopping.id
                        },
                        data: data
                    });

                }catch(err){
                    console.log('Error: ', err);
                    res.status(500).json({
                        response: true,
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

        if(size_id && color_id === undefined){

            color_id = parts_shopping.color_id;

            let item_shopping;
            try{
                item_shopping = await prisma.shopping_cart.findFirst({
                    where: {
                        color_id: color_id,
                        size_id: size_id,
                        user_id: user.id,
                        clothing_id: parts_shopping.clothing_id
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

            if(item_shopping){
                let data = {};
                if(qtd !== undefined){

                    if(typeof qtd !== 'number'){
                        qtd = parseInt(qtd);
                    }

                    let retrievePartData;
                    try{

                        retrievePartData = await prisma.parts_data.findMany({
                            where: {
                                part_id: item_shopping.clothing_id,
                                color_id: item_shopping.color_id,
                                size_id: item_shopping.size_id
                            }
                        });

                    }catch(err){
                        console.log('Error: ', err);
                        res.status(500).json({
                            response: false,
                            msg: 'Ocorreu um erro! Tente novamente.'
                        })
                    }

                    if(qtd < retrievePartData.qtd_parts){
                        data = {
                            qtd_parts: qtd
                        };
                    }else{
                        res.status(404).json({
                            response: false,
                            msg: 'Quantidade de pedido excedido!'
                        });
                        return;
                    }

                }

                data.size_id = size_id;

                try{

                    if(!data){
                        await prisma.shopping_cart.updateMany({
                            where: {
                                id: item_shopping.id
                            },
                            data: data
                        });
                    }

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

            }else{
                try{

                    let data = {
                        size_id: size_id
                    };

                    await prisma.shopping_cart.updateMany({
                        where: {
                           id: parts_shopping.id
                        },
                        data: data
                    });

                }catch(err){
                    console.log('Error: ', err);
                    res.status(500).json({
                        response: true,
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
            });
            return;
        }

        res.status(200).json({
            response: true,
            msg: 'Camiseta removida!'
        })

    }
}