import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersModule } from './users.module';
import { UserEntity } from './entities/user.entity';
import { ProfileEntity } from './entities/profile.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { ConflictException } from '@nestjs/common';
import { DataSource } from 'typeorm';

describe('UsersService (Integration with SQLite)', () => {
    let service: UsersService;
    let module: TestingModule;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot({
                    type: 'sqlite',
                    database: ':memory:',
                    entities: [UserEntity, ProfileEntity],
                    synchronize: true,
                }),
                UsersModule,
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
    });

    afterAll(async () => {
        await module.close();
    });

    beforeEach(async () => {
        const dataSource = module.get(DataSource);
        await dataSource.synchronize(true);
    });

    it('deve estar definido', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        const createUserDto: CreateUserDto = {
            email: 'teste@exemplo.com',
            password: 'senhaForte123',
            profile: {
                firstName: 'João',
                lastName: 'Silva',
                address: 'Rua Teste',
            },
        };

        it('deve criar um usuário com perfil e hash de senha', async () => {
            const user = await service.create(createUserDto);

            expect(user).toBeDefined();
            expect(user.id).toBeDefined();
            expect(user.email).toBe(createUserDto.email);
            expect(user.profile?.firstName).toBe(createUserDto.profile.firstName);

            expect(user.password).not.toBe(createUserDto.password);
            expect(user.password).toMatch(/^\$argon2/);
        });

        it('deve lançar erro ao tentar criar email duplicado', async () => {
            await service.create(createUserDto);

            await expect(service.create(createUserDto))
                .rejects
                .toThrow(ConflictException);
        });
    });

    describe('findAll', () => {
        it('deve retornar lista de usuários', async () => {
            await service.create({ ...createMockDto(), email: 'user1@test.com' });
            await service.create({ ...createMockDto(), email: 'user2@test.com' });

            const users = await service.findAll();
            expect(users).toHaveLength(2);
            expect(users[0].profile).toBeDefined();
        });
    });

    describe('findOne', () => {
        it('deve retornar um usuário pelo ID', async () => {
            const created = await service.create(createMockDto());

            const found = await service.findOne(created.id);

            expect(found).toBeDefined();
            expect(found.id).toEqual(created.id);
            expect(found.email).toEqual(created.email);
        });

        it('deve lançar NotFoundException para ID inexistente', async () => {
            const nonExistentId = '00000000-0000-0000-0000-000000000000';
            await expect(service.findOne(nonExistentId))
                .rejects
                .toThrow('User with ID');
        });
    });

    describe('update', () => {
        it('deve atualizar dados simples (perfil) do usuário', async () => {
            const created = await service.create(createMockDto());

            const updated = await service.update(created.id, {
                profile: { firstName: 'Novo Nome', lastName: 'Novo Sobrenome', address: 'Rua Nova' }
            });

            expect(updated.profile?.firstName).toBe('Novo Nome');
            expect(updated.email).toBe(created.email);
        });

        it('deve hashear a senha novamente se ela for enviada', async () => {
            const created = await service.create(createMockDto());
            const novaSenha = 'novaSenha123';

            const updated = await service.update(created.id, { password: novaSenha });

            expect(updated.password).not.toBe(novaSenha);
            expect(updated.password).not.toBe(created.password);
            expect(updated.password).toMatch(/^\$argon2/);
        });

        it('deve impedir atualização para um email que já existe', async () => {
            await service.create({ ...createMockDto(), email: 'user1@test.com' });
            const user2 = await service.create({ ...createMockDto(), email: 'user2@test.com' });

            await expect(service.update(user2.id, { email: 'user1@test.com' }))
                .rejects
                .toThrow('Email already in use');
        });

        it('deve lançar erro ao tentar atualizar usuário inexistente', async () => {
            await expect(service.update('uuid-falso', { isActive: false }))
                .rejects
                .toThrow();
        });
    });

    describe('remove', () => {
        it('deve remover um usuário existente', async () => {
            const created = await service.create(createMockDto());

            await service.remove(created.id);

            await expect(service.findOne(created.id))
                .rejects
                .toThrow();
        });

        it('deve lançar erro ao tentar remover usuário inexistente', async () => {
            await expect(service.remove('uuid-inexistente'))
                .rejects
                .toThrow();
        });
    });
});

function createMockDto(): CreateUserDto {
    return {
        email: 'random@test.com',
        password: '123',
        profile: { firstName: 'A', lastName: 'B', address: 'C' },
    };
}
