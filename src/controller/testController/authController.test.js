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

    it('Signup test', (done) => {

        request(app)
            .post('/api/signup')
            .send(data)
            .set('Content-type', 'application/json')
            .then((response) => {
                console.log(response.body.msg)
                expect(response.body.response).toBe(true);
                return done();
            });

    });

    it('Signin test', (done) => {
        request(app)
            .post('/api/signin')
            .send({email: data.email, password: data.password})
            .set('Content-type', 'application/json')
            .then((response) => {
                expect(response.body.response).toBe(true);
                return done();
            });
    });

    it('Signin test, email incorrect', (done) => {
        request(app)
            .post('/api/signin')
            .send({ email: 'sdsad@hotmail.com', password: data.password })
            .set('Content-type', 'application/json')
            .then((response) => {
                expect(response.body.response).toBe(false);
                return done();
            })
    });

    it('Signin test, password incorrect, (7 letters)', (done) => {
        request(app)
            .post('/api/signin')
            .send({email: data.email, password: 5876244})
            .set('Content-type', 'application/json')
            .then((response) => {
                expect(response.body.response).toBe(false)
                return done();
            })
    });

    it('Signin test, password incorrect, (20+ letters)', (done) => {
        request(app)
            .post('/api/signin')
            .send({email: data.email, password: 'jeislaketcbd45@41257G'})
            .set('Content-type', 'application/json')
            .then((response) => {
                expect(response.body.response).toBe(false);
                return done();
            })
    })

    afterAll( async () => {
        try{
            await prisma.users.deleteMany();
            await prisma.$disconnect();
        }catch(err){
            console.log('Error: ', err);
        }
    });

});