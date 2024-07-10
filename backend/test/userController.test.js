const request = require('supertest');
const { app, server } = require('../server'); // Assicurati che server sia correttamente esportato

const jwt = require('jsonwebtoken'); // Importa jwt per la verifica del token

describe('POST /api/user/login', () => {
    it('should login an existing user', async () => {
        const credentials = {
            email: 'user@user.it',
            password: '123456'
        };

        const res = await request(app)
            .post('/api/user/login')
            .send(credentials)
            .expect(200);

        // Verifica che la risposta contenga il messaggio di login riuscito e il token
        expect(res.body.isValid).toBe(true);
        expect(res.body.message).toBe('Login successful');
        expect(res.body).toHaveProperty('token');

        // Verifica che il token sia valido decodificandolo
        const decodedToken = jwt.verify(res.body.token, 'chiaveSegreta');
        expect(decodedToken.username).toBe('user');
    });

    it('should return 400 if user is not found', async () => {
        const credentials = {
            email: 'nonexistentuser@example.com',
            password: '123456'
        };

        const res = await request(app)
            .post('/api/user/login')
            .send(credentials)
            .expect(400);

        // Verifica che la risposta contenga il messaggio di errore appropriato
        expect(res.body.isValid).toBe(false);
        expect(res.body.message).toBe('User not found');
    });

    it('should return 400 if password is incorrect', async () => {
        const credentials = {
            email: 'user@user.it',
            password: 'wrongpassword'
        };

        const res = await request(app)
            .post('/api/user/login')
            .send(credentials)
            .expect(400);

        // Verifica che la risposta contenga il messaggio di errore appropriato
        expect(res.body.isValid).toBe(false);
        expect(res.body.message).toBe('Incorrect password');
    });
});

// Chiudi il server dopo che i test sono completati
afterAll(() => {
    server.close();
});
