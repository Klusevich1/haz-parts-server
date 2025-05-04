import { Module } from '@nestjs/common';
import { CarInfoService } from './car-info.service';
import { CarInfoController } from './car-info.controller';
import { CarBrand } from './entities/car-brand.entity';
import { CarModel } from './entities/car-model.entity';
import { CarModification } from './entities/car-modification.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CarBrand, CarModel, CarModification])],
  controllers: [CarInfoController],
  providers: [CarInfoService],
})
export class CarInfoModule {}
