import { Controller, Get, Post, Delete, Body, Query, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddItemDto } from './dto/add-item.dto';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) { }

    @Get()
    @ApiOperation({ summary: 'Get user cart' })
    @ApiQuery({ name: 'userId', required: true, type: String })
    getCart(@Query('userId', ParseUUIDPipe) userId: string) {
        return this.cartService.getCart(userId);
    }

    @Post('items')
    @ApiOperation({ summary: 'Add item to cart' })
    @ApiQuery({ name: 'userId', required: true, type: String })
    addItem(
        @Query('userId', ParseUUIDPipe) userId: string,
        @Body() dto: AddItemDto
    ) {
        return this.cartService.addItem(userId, dto);
    }

    @Delete('items/:productId')
    @ApiOperation({ summary: 'Remove item from cart' })
    @ApiQuery({ name: 'userId', required: true, type: String })
    removeItem(
        @Query('userId', ParseUUIDPipe) userId: string,
        @Param('productId', ParseUUIDPipe) productId: string
    ) {
        return this.cartService.removeItem(userId, productId);
    }
}
