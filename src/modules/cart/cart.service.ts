import { Injectable, BadRequestException } from '@nestjs/common';
import { CartRepository } from './cart.repository';
import { ProductsService } from '../products/products.service';
import { AddItemDto } from './dto/add-item.dto';
import { CartModel } from './models/cart.model';

@Injectable()
export class CartService {
    constructor(
        private readonly cartRepository: CartRepository,
        private readonly productsService: ProductsService,
    ) { }

    async getCart(userId: string): Promise<CartModel> {
        return this.cartRepository.findByUserId(userId);
    }

    async addItem(userId: string, dto: AddItemDto): Promise<CartModel> {
        const product = await this.productsService.findOne(dto.productId);

        if (product.stock < dto.quantity) {
            throw new BadRequestException(`Insufficient stock for product ${product.name}`);
        }

        return this.cartRepository.addItem(userId, dto.productId, dto.quantity);
    }

    async removeItem(userId: string, productId: string): Promise<CartModel> {
        return this.cartRepository.removeItem(userId, productId);
    }

    async clearCart(userId: string) {
        return this.cartRepository.clearCart(userId);
    }
}
