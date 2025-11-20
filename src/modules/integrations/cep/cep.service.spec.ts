import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { CepService } from './cep.service';
import { of } from 'rxjs';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('CepService', () => {
    let service: CepService;
    let httpService: HttpService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CepService,
                {
                    provide: ConfigService,
                    useValue: { get: () => 'https://viacep.com.br/ws' },
                },
                {
                    provide: HttpService,
                    useValue: {
                        get: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<CepService>(CepService);
        httpService = module.get<HttpService>(HttpService);
    });

    it('deve retornar dados do endereço quando CEP é válido', async () => {
        const mockAxiosResponse = {
            data: { logradouro: 'Praça da Sé', erro: undefined },
            status: 200,
            statusText: 'OK',
            headers: {},
            config: {},
        };

        jest.spyOn(httpService, 'get').mockReturnValue(of(mockAxiosResponse as any));

        const result = await service.consultCep('01001000');
        expect(result.logradouro).toBe('Praça da Sé');
    });

    it('deve lançar BadRequest se CEP tiver formato inválido', async () => {
        await expect(service.consultCep('123')).rejects.toThrow(BadRequestException);
    });

    it('deve lançar NotFound se a API retornar { erro: true }', async () => {
        const mockErrorResponse = {
            data: { erro: true },
            status: 200,
        };

        jest.spyOn(httpService, 'get').mockReturnValue(of(mockErrorResponse as any));

        await expect(service.consultCep('99999999')).rejects.toThrow(NotFoundException);
    });
});
