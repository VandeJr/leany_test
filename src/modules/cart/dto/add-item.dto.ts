import { IsUUID, IsInt, Min, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddItemDto {
    @ApiProperty({ example: 'uuid-do-produto' })
    @IsUUID()
    @IsNotEmpty()
    productId: string;

    @ApiProperty({ example: 2 })
    @IsInt()
    @Min(1)
    quantity: number;
}
