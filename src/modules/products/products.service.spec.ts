import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsModule } from './products.module';
import { ProductEntity } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';

describe('ProductsService (Integration)', () => {
    let service: ProductsService;
    let module: TestingModule;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot({
                    type: 'sqlite',
                    database: ':memory:',
                    entities: [ProductEntity],
                    synchronize: true,
                }),
                ProductsModule,
            ],
        }).compile();

        service = module.get<ProductsService>(ProductsService);
    });

    afterAll(async () => {
        await module.close();
    });

    beforeEach(async () => {
        const dataSource = module.get<DataSource>(DataSource);
        await dataSource.synchronize(true);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('deve criar um produto com sucesso', async () => {
            const dto: CreateProductDto = {
                name: 'Notebook Gamer',
                description: 'i7, 16GB RAM, RTX 3060',
                price: 5499.99,
                stock: 10,
                imageUrl: 'http://img.com/note.png',
            };

            const product = await service.create(dto);

            expect(product.id).toBeDefined();
            expect(product.name).toBe(dto.name);
            expect(product.price).toBe(5499.99);
            expect(product.createdAt).toBeDefined();
        });
    });

    describe('findAll', () => {
        it('deve retornar uma lista de produtos', async () => {
            await service.create({ name: 'P1', description: 'D1', price: 10, stock: 1 });
            await service.create({ name: 'P2', description: 'D2', price: 20, stock: 2 });

            const products = await service.findAll();

            expect(products).toHaveLength(2);
            expect(products[0].name).toBe('P1');
            expect(products[1].name).toBe('P2');
        });
    });

    describe('findOne', () => {
        it('deve retornar um produto pelo ID', async () => {
            const created = await service.create({
                name: 'Mouse', description: 'Sem fio', price: 50, stock: 100
            });

            const found = await service.findOne(created.id);

            expect(found).toBeDefined();
            expect(found.id).toBe(created.id);
        });

        it('deve lançar NotFoundException se ID não existir', async () => {
            await expect(service.findOne('00000000-0000-0000-0000-000000000000'))
                .rejects
                .toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it('deve atualizar os dados de um produto', async () => {
            const created = await service.create({
                name: 'Teclado', description: 'Membrana', price: 100, stock: 50
            });

            const updated = await service.update(created.id, {
                name: 'Teclado Mecânico',
                price: 250.00,
            });

            expect(updated.name).toBe('Teclado Mecânico');
            expect(updated.price).toBe(250);
            expect(updated.description).toBe('Membrana');
        });

        it('deve lançar NotFoundException ao tentar atualizar ID inexistente', async () => {
            await expect(service.update('uuid-falso', { price: 10 }))
                .rejects
                .toThrow();
        });
    });

    describe('remove', () => {
        it('deve remover um produto e não encontrá-lo depois', async () => {
            const created = await service.create({
                name: 'Cabo USB', description: 'Tipo C', price: 15, stock: 20
            });

            await service.remove(created.id);

            await expect(service.findOne(created.id))
                .rejects
                .toThrow(NotFoundException);
        });

        it('deve lançar erro ao tentar remover ID inexistente', async () => {
            await expect(service.remove('uuid-invalido'))
                .rejects
                .toThrow();
        });
    });
});
