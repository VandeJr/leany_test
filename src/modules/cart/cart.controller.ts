import { Controller, Get, Post, Delete, Body, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddItemDto } from './dto/add-item.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Cart')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) { }

    @Get()
    @ApiOperation({ summary: 'Get user cart' })
    getCart(@CurrentUser() user: { id: string }) {
        return this.cartService.getCart(user.id);
    }

    @Post('items')
    @ApiOperation({ summary: 'Add item to cart' })
    addItem(
        @CurrentUser() user: { id: string },
        @Body() dto: AddItemDto
    ) {
        return this.cartService.addItem(user.id, dto);
    }

    @Delete('items/:productId')
    @ApiOperation({ summary: 'Remove item from cart' })
    removeItem(
        @CurrentUser() user: { id: string },
        @Param('productId', ParseUUIDPipe) productId: string
    ) {
        return this.cartService.removeItem(user.id, productId);
    }
}
