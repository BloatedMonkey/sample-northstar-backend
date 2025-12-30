import { Module } from '@nestjs/common';
import { ProviderResponsesService } from './provider-responses.service';
import { ProviderResponsesController } from './provider-responses.controller';

@Module({
  controllers: [ProviderResponsesController],
  providers: [ProviderResponsesService],
})
export class ProviderResponsesModule {}
