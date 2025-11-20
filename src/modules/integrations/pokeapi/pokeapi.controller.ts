import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PokeApiService } from './pokeapi.service';
import { PokemonQueryDto } from './dto/pokemon-query.dto';

@ApiTags('Integrations')
@Controller('integrations/pokemon')
export class PokeApiController {
    constructor(private readonly pokeService: PokeApiService) { }

    @Get()
    @ApiOperation({ summary: 'Search pokemon with pagination' })
    async search(@Query() query: PokemonQueryDto) {
        return this.pokeService.search(query);
    }
}
