import { IsOptional, IsInt, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PokemonQueryDto {
    @ApiPropertyOptional({ default: 20 })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    limit?: number = 20;

    @ApiPropertyOptional({ default: 0 })
    @IsOptional()
    @IsInt()
    @Min(0)
    @Type(() => Number)
    offset?: number = 0;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    name?: string;
}
