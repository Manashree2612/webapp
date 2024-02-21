const chai = require('chai');
const supertest = require('supertest');
const app = require('../../app');
const { expect } = chai;

const userController = require('../user.controller');
const verifyToken = require('../auth.controller');

const request = supertest(app);


describe('Integration Tests for user api', () => {

    it('Test 1: Create an account and validate it exists', async () => {
        await request.post('/v1/user').send({
            "first_name": "Manashree",
            "last_name": "Patel",
            "username": "manashree@gmail.com",
            "password": "mannu",
        });

        const credentials = 'manashree@gmail.com:mannu';
        const base64Credentials = Buffer.from(credentials).toString('base64');

        const userResponse = await request.get(`/v1/user/self`).set('Authorization', `Basic ${base64Credentials}`);

        expect(userResponse.status).to.equal(200);
    });


    it('Test 2: Update the account and validate it was updated', async () => {
        const credentials = 'manashree@gmail.com:mannu';
        const base64Credentials = Buffer.from(credentials).toString('base64');

        await request.put('/v1/user/self').set('Authorization', `Basic ${base64Credentials}`).send({
            "last_name": "Nixon"
        });

        const userResponse = await request.get('/v1/user/self').set('Authorization', `Basic ${base64Credentials}`);

        expect(userResponse.status).to.equal(300);
    });

})
