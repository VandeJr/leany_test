import {
    Entity, Column, PrimaryGeneratedColumn, CreateDateColumn,
    OneToOne, JoinColumn
} from 'typeorm';
import { ProfileEntity } from './profile.entity';

import { ShoppingCartEntity } from '../../cart/entities/shopping-cart.entity';
// import { OrderEntity } from '../../orders/entities/order.entity';

@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @OneToOne(() => ProfileEntity, { cascade: true, eager: true })
    @JoinColumn()
    profile: ProfileEntity;

    @OneToOne(() => ShoppingCartEntity, (cart) => cart.user)
    cart: ShoppingCartEntity;

    // @OneToMany(() => OrderEntity, (order) => order.user)
    // orders: OrderEntity[];
}
