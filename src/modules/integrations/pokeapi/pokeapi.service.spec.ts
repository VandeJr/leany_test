import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { NotFoundException } from '@nestjs/common';
import { of, throwError } from 'rxjs';
import { AxiosResponse } from 'axios';
import { PokeApiService } from './pokeapi.service';

describe('PokeApiService', () => {
    let service: PokeApiService;
    let httpService: HttpService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PokeApiService,
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn().mockReturnValue('https://pokeapi.co/api/v2'),
                    },
                },
                {
                    provide: HttpService,
                    useValue: {
                        get: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<PokeApiService>(PokeApiService);
        httpService = module.get<HttpService>(HttpService);
    });

    it('deve estar definido', () => {
        expect(service).toBeDefined();
    });

    describe('search', () => {
        it('deve buscar um pokemon específico pelo nome', async () => {
            const mockResponse: Partial<AxiosResponse> = {
                data: { name: 'pikachu', id: 25 },
                status: 200,
            };

            jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse as AxiosResponse));

            const result = await service.search({ name: 'pikachu' });

            expect(result).toEqual(mockResponse.data);
            expect(httpService.get).toHaveBeenCalledWith(
                'https://pokeapi.co/api/v2/pokemon/pikachu',
            );
        });

        it('deve lançar NotFoundException se o pokemon não existir', async () => {
            jest.spyOn(httpService, 'get').mockReturnValue(
                throwError(() => ({ response: { status: 404 } })),
            );

            await expect(service.search({ name: 'agumon' }))
                .rejects
                .toThrow(NotFoundException);
        });

        it('deve listar pokemons com paginação quando sem nome', async () => {
            const mockResponse: Partial<AxiosResponse> = {
                data: {
                    count: 1000,
                    results: [{ name: 'bulbasaur' }, { name: 'ivysaur' }],
                },
                status: 200,
            };

            jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse as AxiosResponse));

            const query = { limit: 10, offset: 20 };
            const result = await service.search(query);

            expect(result).toEqual(mockResponse.data);

            expect(httpService.get).toHaveBeenCalledWith(
                'https://pokeapi.co/api/v2/pokemon',
                {
                    params: {
                        limit: 10,
                        offset: 20,
                    },
                },
            );
        });
    });
});
