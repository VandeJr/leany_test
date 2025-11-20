import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class CepService {
    private readonly baseUrl: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {
        const baseUrl = this.configService.get<string>('VIACEP_URL');
        if (!baseUrl) {
            throw new Error("VIACEP_URL is not defined");
        }
        this.baseUrl = baseUrl;
    }

    async consultCep(cep: string) {
        const cleanCep = cep.replace(/\D/g, '');

        if (cleanCep.length !== 8) {
            throw new BadRequestException('CEP deve conter 8 dígitos');
        }

        try {
            const response = await lastValueFrom(
                this.httpService.get(`${this.baseUrl}/${cleanCep}/json/`)
            );

            if (response.data.erro) {
                throw new NotFoundException('CEP não encontrado');
            }

            return response.data;
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }
            throw new BadRequestException('Erro ao consultar serviço de CEP');
        }
    }
}
