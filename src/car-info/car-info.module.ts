import { Module } from '@nestjs/common';
import { CarInfoService } from './car-info.service';
import { CarInfoController } from './car-info.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Make } from 'src/entities/make.entity';
import { Model } from 'src/entities/model.entity';
import { ModelModification } from 'src/entities/model-modification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Make, Model, ModelModification])],
  controllers: [CarInfoController],
  providers: [CarInfoService],
})
export class CarInfoModule {}
