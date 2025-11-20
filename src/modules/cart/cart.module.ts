import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CartRepository } from './cart.repository';
import { ShoppingCartEntity } from './entities/shopping-cart.entity';
import { CartProductEntity } from './entities/cart-product.entity';
import { ProductsModule } from '../products/products.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([ShoppingCartEntity, CartProductEntity]),
        ProductsModule,
    ],
    controllers: [CartController],
    providers: [CartService, CartRepository],
    exports: [CartService, CartRepository],
})
export class CartModule { }
