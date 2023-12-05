const app = require('../app');
const dotenv = require('dotenv');

dotenv.config();

app.listen(process.env.PORT, () => {
    console.log(`Serviço Iniciado na PORTA => ${process.env.PORT}`);
});