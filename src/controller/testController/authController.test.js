const request = require('supertest');
const app = require('../../../app');
const User = require('../../models/User');

describe('', () => {

    const data = {
        name: 'store',
        lastName: 'storeTeste',
        email: 'store@store.com',
        password: '@Guilherme91711302',
        state: 'Minas Gerais',
        city: 'Ipatinga',
        neighborhood: 'Granjas Vagalume',
        street: 'Rua Piau',
        number: 60,
        permission: 1
    }

    beforeAll(async (done) => {
        try{
            await User.sync({force: true});
            done();
        }catch(err){
            console.log('Error: ',err);
        }
    }, 10000);

    it('Signup test', (done) => {

        request(app)
            .post('/api/signup')
            .send(data)
            .set('Content-type', 'application/json')
            .then((response) => {
                console.log(response.body.msg)
                expect(response.body.response).toBe(true);
                return done();
            })

    }, 10000);

});