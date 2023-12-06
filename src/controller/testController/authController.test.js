const request = require('supertest');
const app = require('../../../app');
const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');

dotenv.config();

describe('', () => {

    const data = {
        name: 'Vitoria',
        lastName: 'Lima',
        email: 'vitoriasales@store.com',
        password: '@Vitoria91711302',
        state: 'Minas Gerais',
        city: 'Ipatinga',
        neighborhood: 'Granjas Vagalume',
        street: 'Rua Piau',
        number: 60,
        permission: 2
    }

    let prisma;

    beforeAll(() => {
        prisma = new PrismaClient({
            datasources: {
                db: {
                    url: process.env.DATABASE_TEST_URL
                } 
            }
        });
    });

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

    });

});