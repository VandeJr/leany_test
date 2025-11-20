import { Controller, Post, Get, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post()
    @ApiOperation({ summary: 'Checkout: Create order from cart' })
    @ApiResponse({ status: 201, description: 'Order created successfully.' })
    checkout(@CurrentUser() user: { id: string }) {
        return this.ordersService.checkout(user.id);
    }

    @Get()
    @ApiOperation({ summary: 'List user orders' })
    findAll(@CurrentUser() user: { id: string }) {
        return this.ordersService.findAll(user.id);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get order details' })
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.ordersService.findOne(id);
    }
}
