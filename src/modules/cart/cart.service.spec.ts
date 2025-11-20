import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

import { CartModule } from './cart.module';
import { ProductsModule } from '../products/products.module';
import { UsersModule } from '../users/users.module';

import { CartService } from './cart.service';
import { ProductsService } from '../products/products.service';
import { UsersService } from '../users/users.service';

import { ShoppingCartEntity } from './entities/shopping-cart.entity';
import { CartProductEntity } from './entities/cart-product.entity';
import { ProductEntity } from '../products/entities/product.entity';
import { UserEntity } from '../users/entities/user.entity';
import { ProfileEntity } from '../users/entities/profile.entity';

describe('CartService (Integration)', () => {
    let cartService: CartService;
    let productsService: ProductsService;
    let usersService: UsersService;
    let module: TestingModule;
    let dataSource: DataSource;

    let userId: string;
    let productA_Id: string;
    let productB_Id: string;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot({
                    type: 'sqlite',
                    database: ':memory:',
                    entities: [
                        ShoppingCartEntity,
                        CartProductEntity,
                        ProductEntity,
                        UserEntity,
                        ProfileEntity
                    ],
                    synchronize: true,
                }),
                CartModule,
                ProductsModule,
                UsersModule,
            ],
        }).compile();

        cartService = module.get<CartService>(CartService);
        productsService = module.get<ProductsService>(ProductsService);
        usersService = module.get<UsersService>(UsersService);
        dataSource = module.get<DataSource>(DataSource);
    });

    afterAll(async () => {
        await module.close();
    });

    beforeEach(async () => {
        await dataSource.synchronize(true);

        const user = await usersService.create({
            email: 'cliente@teste.com',
            password: '123',
            profile: { firstName: 'Jose', lastName: 'Teste', address: 'Rua A' }
        });
        userId = user.id;

        const prodA = await productsService.create({
            name: 'Mouse Gamer',
            description: 'RGB',
            price: 100.00,
            stock: 10,
        });
        productA_Id = prodA.id;

        const prodB = await productsService.create({
            name: 'Teclado Mecânico',
            description: 'Switch Blue',
            price: 250.00,
            stock: 50,
        });
        productB_Id = prodB.id;
    });

    it('deve estar definido', () => {
        expect(cartService).toBeDefined();
    });

    describe('getCart', () => {
        it('deve retornar um carrinho vazio (e criá-lo) se o usuário acessar pela primeira vez', async () => {
            const cart = await cartService.getCart(userId);

            expect(cart).toBeDefined();
            expect(cart.userId).toBe(userId);
            expect(cart.items).toHaveLength(0);
            expect(cart.total).toBe(0);
        });
    });

    describe('addItem', () => {
        it('deve adicionar um item ao carrinho e calcular o total corretamente', async () => {
            const cart = await cartService.addItem(userId, {
                productId: productA_Id,
                quantity: 2
            });

            expect(cart.items).toHaveLength(1);
            expect(cart.items[0].productName).toBe('Mouse Gamer');
            expect(cart.items[0].quantity).toBe(2);
            expect(cart.items[0].subtotal).toBe(200);
            expect(cart.total).toBe(200);
        });

        it('deve incrementar a quantidade se o item já existir no carrinho', async () => {
            await cartService.addItem(userId, { productId: productA_Id, quantity: 1 });

            const cart = await cartService.addItem(userId, { productId: productA_Id, quantity: 2 });

            expect(cart.items).toHaveLength(1);
            expect(cart.items[0].quantity).toBe(3);
            expect(cart.total).toBe(300);
        });

        it('deve lançar BadRequestException se não houver estoque suficiente', async () => {
            await expect(
                cartService.addItem(userId, { productId: productA_Id, quantity: 11 })
            ).rejects.toThrow(BadRequestException);
        });

        it('deve permitir adicionar múltiplos produtos diferentes', async () => {
            await cartService.addItem(userId, { productId: productA_Id, quantity: 1 });
            const cart = await cartService.addItem(userId, { productId: productB_Id, quantity: 1 });

            expect(cart.items).toHaveLength(2);
            expect(cart.total).toBe(350);
        });
    });

    describe('removeItem', () => {
        it('deve remover um item do carrinho', async () => {
            await cartService.addItem(userId, { productId: productA_Id, quantity: 1 });

            const cart = await cartService.removeItem(userId, productA_Id);

            expect(cart.items).toHaveLength(0);
            expect(cart.total).toBe(0);
        });

        it('não deve falhar se tentar remover um item que não existe', async () => {
            const cart = await cartService.removeItem(userId, productB_Id);
            expect(cart).toBeDefined();
            expect(cart.items).toHaveLength(0);
        });
    });
});
