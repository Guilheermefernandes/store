module.exports = {
    createdAd: async (req, res) => {

        //availability -> [pt-br] Disponibilidade -> Object typeOf

        const fields = [
            'title',
            'price',
            'describe_tshirt',
            'collection',
            'discount',
            'availability'
        ];

        let newAd = {};

        for(const field of fields){
            if(req.body[field]){

                if(field === 'price'){

                    const value = parseInt(req.body[field]);
                    console.log(typeof value)

                    if(typeof value !== 'number'){
                        res.json({ response: false, msg: 'Dados incorretos!' });
                        return;
                    }
                
                    newAd.price = value;
                }

                if(field === 'availability'){
                    continue;
                }

                newAd[field] = req.body[field];
            }
        }

        /*
        let tshirt;
        try{
            const createdTshirt = Tshirt.build(newAd);
            tshirt = await createdTshirt.save();

            console.log('Aqui esta sua menssagem que você que ver: ', tshirt.get().id);

            if(req.body.availability){
                        
                const objectDataTshirt = req.body.availability;
                for(let i in objectDataTshirt){
                    const addReferencesTshirt = {};
                    
                    const valueColor = parseInt(objectDataTshirt[0].color);
                    const valueSize = parseInt(objectDataTshirt[0].size);
                    const valueQtd = parseInt(objectDataTshirt[0].qtd);

                    console.log(typeof valueColor)

                    addReferencesTshirt.color = valueColor;
                    addReferencesTshirt.size = valueSize;
                    addReferencesTshirt.tshirt = tshirt.get().id;
                    addReferencesTshirt.qtd_tshirt = valueQtd;

                    try{
                        const saveDataTshirt = TshirtData.build(addReferencesTshirt);
                        await saveDataTshirt.save();
                    }catch(err){
                        console.log('Error: ', err);
                        res.status(500).json({ response: false, msg: 'Ocorreu um erro interno! Tente novamente.'});
                        return;
                    }
                    
                }

            }
        }catch(error){
            console.log('Error: ', error);
            res.status(500).json({ response: false, msg: 'Ocorreu um erro interno! Tente novamente.'});
            return;
        }

        res.status(201).json({ response: true, msg: 'Camisa cadastrada!' });

        */
    },
    getAd: async (req, res) => {


    }
}