import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('E-Commerce Full Flow (E2E)', () => {
    let app: INestApplication;
    let authToken: string;
    let createdProductId: string;
    let userId: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();

        app.useGlobalPipes(new ValidationPipe({
            whitelist: true,
            transform: true
        }));

        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('/users (POST) - Create User', async () => {
        const userDto = {
            email: `e2e_${Date.now()}@test.com`,
            password: 'strongPassword123',
            profile: {
                firstName: 'E2E',
                lastName: 'Tester',
                address: 'Virtual Street'
            }
        };

        const response = await request(app.getHttpServer())
            .post('/users')
            .send(userDto)
            .expect(201);

        expect(response.body.id).toBeDefined();
        expect(response.body.password).toBeUndefined();
        userId = response.body.id;
    });

    it('/auth/login (POST) - Get Token', async () => {
        const email = `e2e_login_${Date.now()}@test.com`;

        await request(app.getHttpServer()).post('/users').send({
            email,
            password: '123456',
            profile: { firstName: 'Login', lastName: 'User', address: 'A' }
        });

        const response = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ email, password: '123456' })
            .expect(200);

        expect(response.body.access_token).toBeDefined();
        authToken = response.body.access_token;
    });

    it('/products (POST) - Create Product', async () => {
        const productDto = {
            name: 'E2E Product',
            description: 'Test Description',
            price: 100.50,
            stock: 10
        };

        const response = await request(app.getHttpServer())
            .post('/products')
            .set('Authorization', `Bearer ${authToken}`)
            .send(productDto)
            .expect(201);

        expect(response.body.id).toBeDefined();
        createdProductId = response.body.id;
    });

    it('/cart/items (POST) - Add Item', async () => {
        return request(app.getHttpServer())
            .post('/cart/items')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                productId: createdProductId,
                quantity: 2
            })
            .expect(201);
    });

    it('/orders (POST) - Checkout', async () => {
        const response = await request(app.getHttpServer())
            .post('/orders')
            .set('Authorization', `Bearer ${authToken}`)
            .expect(201);

        expect(response.body.total).toBe(201.00);
        expect(response.body.items).toHaveLength(1);
    });
});
