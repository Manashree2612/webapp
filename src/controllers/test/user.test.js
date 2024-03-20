const chai = require('chai');
const supertest = require('supertest');
const app = require('../../app');
const db = require('../../models/index.js');

const { expect } = chai;

const request = supertest(app);

describe('Integration Tests for user api', () => {

    it('Create account to validate it exists', async () => {
      
        await request.post('/v1/user').send({
            "first_name": "Manashree",
            "last_name": "Patel",
            "username": "man@gmail.com",
            "password": "mannu",
        });

        const credentials = 'man@gmail.com:mannu';
        const base64Credentials = Buffer.from(credentials).toString('base64');

        const userResponse = await request.get(`/v1/user/self`).set('Authorization', `Basic ${base64Credentials}`);
        console.log('userResponse', userResponse);
        expect(userResponse.status).to.equal(200);
       
    });


    it('Update the account information', async () => {
    
        const credentials = 'man@gmail.com:mannu';
        const base64Credentials = Buffer.from(credentials).toString('base64');

        await request.put('/v1/user/self').set('Authorization', `Basic ${base64Credentials}`).send({
            "last_name": "Nixon"
        });

        const userResponse = await request.get('/v1/user/self').set('Authorization', `Basic ${base64Credentials}`);

        expect(userResponse.status).to.equal(200);
       
    });

})