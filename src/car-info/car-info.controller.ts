import { Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { CarInfoService } from './car-info.service';

@Controller('car-info')
export class CarInfoController {
  constructor(private readonly carInfoService: CarInfoService) {}

  @Get('brands')
  async getAllBrands() {
    return this.carInfoService.getAllBrands();
  }

  @Get('models')
  async getByMake(@Query('makeId', ParseIntPipe) makeId: number) {
    return this.carInfoService.getModelsByMake(makeId);
  }

  @Get('modifications')
  async getByModel(@Query('modelId', ParseIntPipe) modelId: number) {
    return this.carInfoService.getModificationsByModel(modelId);
  }

  @Post('import')
  async importCarData() {
    return this.carInfoService.loadCarDataFromFile();
  }
}
