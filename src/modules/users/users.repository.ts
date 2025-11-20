import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { UserModel, ProfileModel } from './models/user.model';

@Injectable()
export class UsersRepository {
    constructor(
        @InjectRepository(UserEntity)
        private readonly typeOrmRepo: Repository<UserEntity>,
    ) { }

    private toDomain(entity: UserEntity): UserModel {
        let profileModel: ProfileModel | undefined;

        if (entity.profile) {
            profileModel = new ProfileModel(
                entity.profile.firstName,
                entity.profile.lastName,
                entity.profile.address,
            );
        }

        return new UserModel(
            entity.id,
            entity.email,
            entity.isActive,
            entity.createdAt,
            entity.password,
            profileModel,
        );
    }

    private toPersistence(model: Partial<UserModel>): DeepPartial<UserEntity> {
        const entity: any = {
            id: model.id,
            email: model.email,
            password: model.password,
            isActive: model.isActive,
        };

        if (model.profile) {
            entity.profile = {
                firstName: model.profile.firstName,
                lastName: model.profile.lastName,
                address: model.profile.address,
            };
        }

        return entity;
    }

    async create(data: UserModel): Promise<UserModel> {
        const persistenceData = this.toPersistence(data);
        const entity = this.typeOrmRepo.create(persistenceData);
        const saved = await this.typeOrmRepo.save(entity);
        return this.toDomain(saved);
    }

    async findByEmail(email: string): Promise<UserModel | null> {
        const entity = await this.typeOrmRepo.findOne({ where: { email } });
        if (!entity) return null;
        return this.toDomain(entity);
    }

    async findById(id: string): Promise<UserModel | null> {
        const entity = await this.typeOrmRepo.findOne({ where: { id } });
        if (!entity) return null;
        return this.toDomain(entity);
    }

    async findAll(): Promise<UserModel[]> {
        const entities = await this.typeOrmRepo.find();
        return entities.map((e) => this.toDomain(e));
    }

    async update(id: string, data: Partial<UserModel>): Promise<UserModel> {
        const entity = await this.typeOrmRepo.findOne({ where: { id } });

        if (!entity) {
            throw new NotFoundException('User not found');
        }

        if (data.email) entity.email = data.email;
        if (data.password) entity.password = data.password;
        if (data.isActive !== undefined) entity.isActive = data.isActive;

        if (data.profile) {
            entity.profile.firstName = data.profile.firstName || entity.profile.firstName;
            entity.profile.lastName = data.profile.lastName || entity.profile.lastName;
            entity.profile.address = data.profile.address || entity.profile.address;
        }

        const updated = await this.typeOrmRepo.save(entity);
        return this.toDomain(updated);
    }

    async remove(id: string): Promise<void> {
        await this.typeOrmRepo.delete(id);
    }
}
