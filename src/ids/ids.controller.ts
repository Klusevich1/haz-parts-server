import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { IdsService } from './ids.service';

@Controller('ids')
export class IdsController {
  constructor(private readonly idsService: IdsService) {}

  @Get('make/:slug')
  getMakeId(@Param('slug') slug: string) {
    return this.idsService.getMakeIdBySlug(slug);
  }

  @Get('model/:slug')
  getModelId(@Param('slug') slug: string) {
    return this.idsService.getModelIdBySlug(slug);
  }

  @Get('modification/:slug')
  getModificationId(@Param('slug') slug: string) {
    return this.idsService.getModificationIdBySlug(slug);
  }

  @Post('manufacturers')
  async getManufacturerIds(@Body('slugs') slugs: string[]) {
    const ids = await this.idsService.getManufacturerIds(slugs);
    return { ids };
  }

  @Post('warehouses')
  async getWarehouseIds(@Body('slugs') slugs: string[]) {
    const ids = await this.idsService.getWarehouseIds(slugs);
    return { ids };
  }
}
