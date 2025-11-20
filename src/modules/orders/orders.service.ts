import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { OrdersRepository } from './orders.repository';
import { CartService } from '../cart/cart.service';
import { OrderModel } from './models/order.model';

@Injectable()
export class OrdersService {
    constructor(
        private readonly ordersRepository: OrdersRepository,
        private readonly cartService: CartService,
    ) { }

    async checkout(userId: string): Promise<OrderModel> {
        const cart = await this.cartService.getCart(userId);

        if (!cart.items.length) {
            throw new BadRequestException('Cart is empty');
        }

        const order = await this.ordersRepository.createFromCart(userId, cart);
        await this.cartService.clearCart(userId);

        return order;
    }

    async findAll(userId: string) {
        return this.ordersRepository.findAllByUserId(userId);
    }

    async findOne(id: string) {
        const order = await this.ordersRepository.findById(id);
        if (!order) throw new NotFoundException('Order not found');
        return order;
    }
}
