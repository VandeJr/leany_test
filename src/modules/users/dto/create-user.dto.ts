import { IsEmail, IsNotEmpty, MinLength, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class CreateProfileDto {
    @ApiProperty({ example: 'John' })
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty({ example: 'Doe' })
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @ApiProperty({ example: 'Rua X, 123' })
    @IsString()
    @IsNotEmpty()
    address: string;
}

export class CreateUserDto {
    @ApiProperty({ example: 'user@email.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'strongpassword' })
    @MinLength(6)
    @IsString()
    password: string;

    @ApiProperty()
    @ValidateNested()
    @Type(() => CreateProfileDto)
    profile: CreateProfileDto;
}
