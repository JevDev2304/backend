import { Module } from '@nestjs/common';
import { WompiService } from './wompi.service';
import { WompiController } from './wompi.controller';

@Module({
  providers: [WompiService],
  exports:[WompiService],
  controllers: [WompiController]
})
export class WompiModule {}
