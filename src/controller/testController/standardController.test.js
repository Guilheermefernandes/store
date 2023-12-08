const request = require('supertest');
const app = require('../../../app');
const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');

dotenv.config();

describe('', () => {

    const data = {
        name: 'Vitoria',
        lastName: 'Lima',
        email: 'vitorialima@store.com',
        password: '@Vitoria91711302',
        state: 'Minas Gerais',
        city: 'Ipatinga',
        neighborhood: 'Granjas Vagalume',
        street: 'Rua Piau',
        number: 60,
        permission: 2
    }

    let token;

    let prisma;

    beforeAll( async () => {
        prisma = new PrismaClient({
            datasources: {
                db: {
                    url: process.env.DATABASE_TEST_URL
                } 
            }
        });
    });

    it('Signup', (done) => {
        request(app)
            .post('/api/signup')
            .send(data)
            .set('Content-type', 'application/json')
            .then((response) => {
                expect(response.body.response).toBe(true);
                return done();
            });
    });

    it('Signin', (done) => {
        request(app)
            .post('/api/signin')
            .send({email: data.email, password: data.password})
            .set('Content-type', 'application/json')
            .then((response) => {
                expect(response.body.response).toBe(true);
                token = response.body.token;
                return done();
            })
    });

    it('Request colors standard', (done) => {
        request(app)
            .get('/api/colors')
            .set('authorization', `bearer ${token}`)
            .then((response) => {
                expect(response.body.response).toBe(true);
                return done();
            });   
    })

});