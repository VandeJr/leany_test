import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductModel } from './models/product.model';

@Injectable()
export class ProductsService {
    constructor(private readonly productsRepository: ProductsRepository) { }

    async create(dto: CreateProductDto): Promise<ProductModel> {
        return this.productsRepository.create(dto);
    }

    findAll(): Promise<ProductModel[]> {
        return this.productsRepository.findAll();
    }

    async findOne(id: string): Promise<ProductModel> {
        const product = await this.productsRepository.findById(id);
        if (!product) throw new NotFoundException(`Product with ID ${id} not found`);
        return product;
    }

    async update(id: string, dto: UpdateProductDto): Promise<ProductModel> {
        await this.findOne(id);
        return this.productsRepository.update(id, dto);
    }

    async remove(id: string): Promise<void> {
        await this.findOne(id);
        await this.productsRepository.remove(id);
    }
}
