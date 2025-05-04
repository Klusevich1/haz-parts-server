import { Controller, Get, Post, Query } from '@nestjs/common';
import { CarInfoService } from './car-info.service';

@Controller('car-info')
export class CarInfoController {
  constructor(private readonly carInfoService: CarInfoService) {}

  @Get()
  async getAllBrands() {
    return this.carInfoService.getAllBrands();
  }

  @Get('brands')
  async getAllBrandsNames() {
    return this.carInfoService.getAllBrandsNames();
  }

  @Get('models')
  async getModelsByBrand(@Query('brand') brand: string) {
    return this.carInfoService.getModelsByBrandName(brand);
  }

  @Post('import')
  async importCarData() {
    return this.carInfoService.loadCarDataFromFile();
  }
}
