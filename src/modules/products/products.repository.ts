import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from './entities/product.entity';
import { ProductModel } from './models/product.model';

@Injectable()
export class ProductsRepository {
    constructor(
        @InjectRepository(ProductEntity)
        private readonly typeOrmRepo: Repository<ProductEntity>,
    ) { }

    private toDomain(entity: ProductEntity): ProductModel {
        return new ProductModel(
            entity.id,
            entity.name,
            entity.description,
            entity.price,
            entity.stock,
            entity.createdAt,
            entity.updatedAt,
            entity.imageUrl,
        );
    }

    async create(data: Partial<ProductModel>): Promise<ProductModel> {
        const entity = this.typeOrmRepo.create(data);
        const saved = await this.typeOrmRepo.save(entity);
        return this.toDomain(saved);
    }

    async findAll(): Promise<ProductModel[]> {
        const entities = await this.typeOrmRepo.find({ order: { createdAt: 'DESC' } });
        return entities.map((e) => this.toDomain(e));
    }

    async findById(id: string): Promise<ProductModel | null> {
        const entity = await this.typeOrmRepo.findOne({ where: { id } });
        return entity ? this.toDomain(entity) : null;
    }

    async update(id: string, data: Partial<ProductModel>): Promise<ProductModel> {
        const result = await this.typeOrmRepo.update(id, data);

        if (result.affected === 0) {
            throw new NotFoundException('Product not found');
        }

        return this.findById(id) as Promise<ProductModel>;
    }

    async remove(id: string): Promise<void> {
        const result = await this.typeOrmRepo.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException('Product not found');
        }
    }
}
