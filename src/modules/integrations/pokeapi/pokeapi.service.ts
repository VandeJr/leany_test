import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { PokemonQueryDto } from './dto/pokemon-query.dto';

@Injectable()
export class PokeApiService {
    private readonly baseUrl: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {
        const baseUrl = this.configService.get<string>('POKEAPI_URL');
        if (!baseUrl) {
            throw new Error("POKEAPI_URL is not defined");
        }
        this.baseUrl = baseUrl;
    }


    async search(query: PokemonQueryDto) {
        if (query.name) {
            try {
                const { data } = await lastValueFrom(
                    this.httpService.get(`${this.baseUrl}/pokemon/${query.name.toLowerCase()}`)
                );
                return data;
            } catch (error) {
                throw new NotFoundException(`Pokemon ${query.name} not found`);
            }
        }

        const { data } = await lastValueFrom(
            this.httpService.get(`${this.baseUrl}/pokemon`, {
                params: {
                    limit: query.limit,
                    offset: query.offset,
                },
            }),
        );

        return data;
    }
}
