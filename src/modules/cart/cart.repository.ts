import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShoppingCartEntity } from './entities/shopping-cart.entity';
import { CartProductEntity } from './entities/cart-product.entity';
import { ProductEntity } from '../products/entities/product.entity';
import { UserEntity } from '../users/entities/user.entity';
import { CartModel, CartItemModel } from './models/cart.model';

@Injectable()
export class CartRepository {
    constructor(
        @InjectRepository(ShoppingCartEntity)
        private readonly cartRepo: Repository<ShoppingCartEntity>,
        @InjectRepository(CartProductEntity)
        private readonly itemRepo: Repository<CartProductEntity>,
    ) { }

    private toDomain(entity: ShoppingCartEntity): CartModel {
        const items = (entity.items || []).map(item => {
            return new CartItemModel(
                item.product.id,
                item.product.name,
                Number(item.product.price),
                item.quantity
            );
        });

        return new CartModel(entity.id, entity.user?.id, items);
    }

    async findByUserId(userId: string): Promise<CartModel> {
        let cart = await this.cartRepo.findOne({
            where: { user: { id: userId } },
            relations: ['items', 'items.product', 'user']
        });

        if (!cart) {
            const newCart = this.cartRepo.create({
                user: { id: userId } as UserEntity
            });
            cart = await this.cartRepo.save(newCart);
        }

        return this.toDomain(cart);
    }

    async addItem(userId: string, productId: string, quantity: number): Promise<CartModel> {
        let cart = await this.cartRepo.findOne({
            where: { user: { id: userId } },
            relations: ['items', 'items.product']
        });

        if (!cart) {
            cart = await this.cartRepo.save(this.cartRepo.create({ user: { id: userId } as UserEntity }));
        }

        const existingItem = await this.itemRepo.findOne({
            where: { cart: { id: cart.id }, product: { id: productId } }
        });

        if (existingItem) {
            existingItem.quantity += quantity;
            await this.itemRepo.save(existingItem);
        } else {
            const newItem = this.itemRepo.create({
                cart: { id: cart.id } as ShoppingCartEntity,
                product: { id: productId } as ProductEntity,
                quantity: quantity
            });
            await this.itemRepo.save(newItem);
        }

        return this.findByUserId(userId);
    }

    async removeItem(userId: string, productId: string): Promise<CartModel> {
        const cart = await this.cartRepo.findOne({ where: { user: { id: userId } } });

        if (cart) {
            await this.itemRepo.delete({
                cart: { id: cart.id },
                product: { id: productId }
            });
        }

        return this.findByUserId(userId);
    }

    async clearCart(userId: string): Promise<void> {
        const cart = await this.cartRepo.findOne({ where: { user: { id: userId } } });
        if (cart) {
            await this.itemRepo.delete({ cart: { id: cart.id } });
        }
    }
}
