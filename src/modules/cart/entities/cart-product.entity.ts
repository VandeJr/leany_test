import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ShoppingCartEntity } from './shopping-cart.entity';
import { ProductEntity } from '../../products/entities/product.entity';

@Entity('cart_products')
export class CartProductEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('int')
    quantity: number;

    @ManyToOne(() => ShoppingCartEntity, (cart) => cart.items, { onDelete: 'CASCADE' })
    cart: ShoppingCartEntity;

    @ManyToOne(() => ProductEntity, { eager: true })
    @JoinColumn()
    product: ProductEntity;
}
