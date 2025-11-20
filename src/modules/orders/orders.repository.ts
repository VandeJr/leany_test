import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from './entities/order.entity';
import { OrderItemEntity } from './entities/order-item.entity';
import { OrderModel, OrderItemModel } from './models/order.model';
import { UserEntity } from '../users/entities/user.entity';
import { CartModel } from '../cart/models/cart.model';
import { ProductEntity } from '../products/entities/product.entity';

@Injectable()
export class OrdersRepository {
    constructor(
        @InjectRepository(OrderEntity)
        private readonly orderRepo: Repository<OrderEntity>,
    ) { }

    private toDomain(entity: OrderEntity): OrderModel {
        const items = entity.items.map(item => new OrderItemModel(
            item.product?.id,
            Number(item.price),
            item.quantity
        ));

        return new OrderModel(
            entity.id,
            entity.user?.id,
            Number(entity.total),
            entity.status as any,
            entity.createdAt,
            items
        );
    }

    async createFromCart(userId: string, cart: CartModel): Promise<OrderModel> {
        const order = new OrderEntity();
        order.user = { id: userId } as UserEntity;
        order.total = cart.total;

        order.items = cart.items.map(cartItem => {
            const orderItem = new OrderItemEntity();
            orderItem.product = { id: cartItem.productId } as ProductEntity;
            orderItem.price = cartItem.unitPrice;
            orderItem.quantity = cartItem.quantity;
            return orderItem;
        });

        const savedOrder = await this.orderRepo.save(order);
        return this.toDomain(savedOrder);
    }

    async findAllByUserId(userId: string): Promise<OrderModel[]> {
        const orders = await this.orderRepo.find({
            where: { user: { id: userId } },
            order: { createdAt: 'DESC' },
            relations: ['user', 'items', 'items.product']
        });
        return orders.map(o => this.toDomain(o));
    }

    async findById(id: string): Promise<OrderModel | null> {
        const order = await this.orderRepo.findOne({
            where: { id },
            relations: ['user', 'items', 'items.product']
        });
        return order ? this.toDomain(order) : null;
    }
}
