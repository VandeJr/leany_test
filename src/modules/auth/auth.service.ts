import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async login(dto: LoginDto) {
        const user = await this.usersService.findByEmail(dto.email);

        if (!user || !user.password) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        const isPasswordValid = await argon2.verify(user.password, dto.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        const payload = { email: user.email, sub: user.id };

        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                profile: user.profile
            }
        };
    }
}
