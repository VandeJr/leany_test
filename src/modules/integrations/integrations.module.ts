import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CepService } from './cep/cep.service';
import { CepController } from './cep/cep.controller';
import { PokeApiService } from './pokeapi/pokeapi.service';
import { PokeApiController } from './pokeapi/pokeapi.controller';

@Module({
    imports: [
        HttpModule.register({
            timeout: 5000,
            maxRedirects: 5,
        }),
    ],
    controllers: [CepController, PokeApiController],
    providers: [CepService, PokeApiService],
})
export class IntegrationsModule { }
