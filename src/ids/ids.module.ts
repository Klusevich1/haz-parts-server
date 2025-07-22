import { Module } from '@nestjs/common';
import { IdsService } from './ids.service';
import { IdsController } from './ids.controller';
import { Make } from 'src/entities/make.entity';
import { Model } from 'src/entities/model.entity';
import { ModelModification } from 'src/entities/model-modification.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Manufacturer } from 'src/entities/manufacturer.entity';
import { Warehouse } from 'src/entities/warehouse.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Make,
      Model,
      ModelModification,
      Manufacturer,
      Warehouse,
    ]),
  ],
  controllers: [IdsController],
  providers: [IdsService],
})
export class IdsModule {}
