import { Controller, Post, Get, Param, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { OrdersService } from './orders.service';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post()
    @ApiOperation({ summary: 'Checkout: Create order from cart' })
    @ApiQuery({ name: 'userId', required: true, type: String })
    checkout(@Query('userId', ParseUUIDPipe) userId: string) {
        return this.ordersService.checkout(userId);
    }

    @Get()
    @ApiOperation({ summary: 'List user orders' })
    @ApiQuery({ name: 'userId', required: true, type: String })
    findAll(@Query('userId', ParseUUIDPipe) userId: string) {
        return this.ordersService.findAll(userId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get order details' })
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.ordersService.findOne(id);
    }
}
