import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import * as argon2 from 'argon2';

jest.mock('argon2');

const mockUsersService = {
    findByEmail: jest.fn(),
};

const mockJwtService = {
    sign: jest.fn(() => 'fake_token'),
};

describe('AuthService', () => {
    let authService: AuthService;
    let usersService: typeof mockUsersService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: UsersService, useValue: mockUsersService },
                { provide: JwtService, useValue: mockJwtService },
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        usersService = module.get(UsersService);

        jest.clearAllMocks();
    });

    it('deve estar definido', () => {
        expect(authService).toBeDefined();
    });

    describe('login', () => {
        const loginDto = { email: 'teste@teste.com', password: '123' };
        const mockUser = {
            id: 'uuid',
            email: 'teste@teste.com',
            password: '$argon2id$hash_valido',
            profile: {}
        };

        it('deve retornar token e usuário quando credenciais são válidas', async () => {
            usersService.findByEmail.mockResolvedValue(mockUser);

            (argon2.verify as jest.Mock).mockResolvedValue(true);

            const result = await authService.login(loginDto);

            expect(result).toHaveProperty('access_token');
            expect(result.access_token).toBe('fake_token');
            expect(mockJwtService.sign).toHaveBeenCalled();
        });

        it('deve lançar UnauthorizedException se usuário não for encontrado', async () => {
            usersService.findByEmail.mockResolvedValue(null);

            await expect(authService.login(loginDto))
                .rejects
                .toThrow(UnauthorizedException);
        });

        it('deve lançar UnauthorizedException se a senha estiver incorreta', async () => {
            usersService.findByEmail.mockResolvedValue(mockUser);

            (argon2.verify as jest.Mock).mockResolvedValue(false);

            await expect(authService.login(loginDto))
                .rejects
                .toThrow(UnauthorizedException);
        });
    });
});
