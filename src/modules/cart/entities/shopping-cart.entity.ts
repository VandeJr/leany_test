import { Entity, PrimaryGeneratedColumn, CreateDateColumn, OneToOne, JoinColumn, OneToMany, UpdateDateColumn } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { CartProductEntity } from './cart-product.entity';

@Entity('shopping_carts')
export class ShoppingCartEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => UserEntity)
    @JoinColumn()
    user: UserEntity;

    @OneToMany(() => CartProductEntity, (item) => item.cart, { cascade: true })
    items: CartProductEntity[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
