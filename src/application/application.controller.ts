import { Controller, Post, Get, Body } from '@nestjs/common';
import { ApplicationService } from './application.service';

@Controller('application')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post()
  async createApplication(@Body() data: { fullname: string; phone: string }) {
    const response = await this.applicationService.createApplication(data);
    return response;
  }
}
