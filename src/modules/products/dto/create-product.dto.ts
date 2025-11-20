import { IsString, IsNotEmpty, IsNumber, Min, IsOptional, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
    @ApiProperty({ example: 'iPhone 15' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'Smartphone de última geração' })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ example: 999.99 })
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    price: number;

    @ApiProperty({ example: 10 })
    @IsNumber()
    @Min(0)
    stock: number;

    @ApiProperty({ required: false, example: 'https://example.com/image.png' })
    @IsOptional()
    @IsUrl()
    imageUrl?: string;
}
