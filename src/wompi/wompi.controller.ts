import { Controller, Get, InternalServerErrorException } from '@nestjs/common';
import { WompiService } from './wompi.service';

@Controller('wompi')
export class WompiController {
  constructor(private readonly wompiService: WompiService) {}

  @Get('acceptance-details')
  async getAcceptanceDetails() {
    try {
      return await this.wompiService.getAcceptanceDetails();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}