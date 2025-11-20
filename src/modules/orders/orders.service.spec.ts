import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

import { OrdersModule } from './orders.module';
import { OrdersService } from './orders.service';
import { CartService } from '../cart/cart.service';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';
import { CartModule } from '../cart/cart.module';
import { UsersModule } from '../users/users.module';
import { ProductsModule } from '../products/products.module';

import { OrderEntity } from './entities/order.entity';
import { OrderItemEntity } from './entities/order-item.entity';
import { ShoppingCartEntity } from '../cart/entities/shopping-cart.entity';
import { CartProductEntity } from '../cart/entities/cart-product.entity';
import { ProductEntity } from '../products/entities/product.entity';
import { UserEntity } from '../users/entities/user.entity';
import { ProfileEntity } from '../users/entities/profile.entity';

describe('OrdersService (Integration)', () => {
    let service: OrdersService;
    let cartService: CartService;
    let usersService: UsersService;
    let productsService: ProductsService;
    let module: TestingModule;
    let dataSource: DataSource;

    let userId: string;
    let productId: string;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot({
                    type: 'sqlite',
                    database: ':memory:',
                    entities: [
                        OrderEntity, OrderItemEntity,
                        ShoppingCartEntity, CartProductEntity,
                        ProductEntity, UserEntity, ProfileEntity
                    ],
                    synchronize: true,
                }),
                OrdersModule,
                CartModule,
                UsersModule,
                ProductsModule
            ],
        }).compile();

        service = module.get<OrdersService>(OrdersService);
        cartService = module.get<CartService>(CartService);
        usersService = module.get<UsersService>(UsersService);
        productsService = module.get<ProductsService>(ProductsService);
        dataSource = module.get<DataSource>(DataSource);
    });

    afterAll(async () => {
        await module.close();
    });

    beforeEach(async () => {
        await dataSource.synchronize(true);

        const user = await usersService.create({
            email: 'comprador@teste.com',
            password: '123',
            profile: { firstName: 'Comprador', lastName: 'Um', address: 'Rua 1' }
        });
        userId = user.id;

        const product = await productsService.create({
            name: 'Produto Teste',
            description: 'Desc',
            price: 50.00,
            stock: 100
        });
        productId = product.id;
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('checkout', () => {
        it('deve criar um pedido e limpar o carrinho', async () => {
            await cartService.addItem(userId, { productId, quantity: 2 });

            const order = await service.checkout(userId);

            expect(order).toBeDefined();
            expect(order.total).toBe(100.00);
            expect(order.items).toHaveLength(1);
            expect(order.items[0].price).toBe(50.00);
            expect(order.items[0].quantity).toBe(2);

            const cart = await cartService.getCart(userId);
            expect(cart.items).toHaveLength(0);
            expect(cart.total).toBe(0);
        });

        it('deve falhar se o carrinho estiver vazio', async () => {
            await expect(service.checkout(userId))
                .rejects
                .toThrow(BadRequestException);
        });
    });

    describe('findAll', () => {
        it('deve listar os pedidos do usuário', async () => {
            await cartService.addItem(userId, { productId, quantity: 1 });
            await service.checkout(userId);

            await cartService.addItem(userId, { productId, quantity: 3 });
            await service.checkout(userId);

            const orders = await service.findAll(userId);

            expect(orders).toHaveLength(2);
            expect(orders[0].total).toBe(50.00);
            expect(orders[1].total).toBe(150.00);
        });
    });

    describe('findOne', () => {
        it('deve encontrar um pedido pelo ID', async () => {
            await cartService.addItem(userId, { productId, quantity: 1 });
            const created = await service.checkout(userId);

            const found = await service.findOne(created.id);

            expect(found).toBeDefined();
            expect(found.id).toBe(created.id);
            expect(found.items[0].productId).toBe(productId);
        });

        it('deve lançar erro para pedido inexistente', async () => {
            await expect(service.findOne('uuid-invalido'))
                .rejects
                .toThrow();
        });
    });
});
