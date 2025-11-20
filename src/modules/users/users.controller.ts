import {
    Controller, Get, Post, Body, Patch, Param, Delete,
    ParseUUIDPipe, HttpCode, HttpStatus
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    @ApiOperation({ summary: 'Create user with profile' })
    async create(@Body() dto: CreateUserDto) {
        const user = await this.usersService.create(dto);
        const { password, ...result } = user;
        return result;
    }

    @Get()
    async findAll() {
        const users = await this.usersService.findAll();
        return users.map(({ password, ...u }) => u);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get user by ID' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async findOne(@Param('id', ParseUUIDPipe) id: string) {
        const user = await this.usersService.findOne(id);
        const { password, ...result } = user;
        return result;
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update user' })
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateUserDto
    ) {
        const user = await this.usersService.update(id, dto);
        const { password, ...result } = user;
        return result;
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete user' })
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id', ParseUUIDPipe) id: string) {
        await this.usersService.remove(id);
    }
}
