import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CepService } from './cep.service';

@ApiTags('Integrations')
@Controller('integrations/cep')
export class CepController {
    constructor(private readonly cepService: CepService) { }

    @Get(':cep')
    @ApiOperation({ summary: 'Consulta endereço por CEP' })
    @ApiResponse({ status: 200, description: 'Endereço encontrado.' })
    @ApiResponse({ status: 404, description: 'CEP não encontrado.' })
    async getCep(@Param('cep') cep: string) {
        return this.cepService.consultCep(cep);
    }
}
