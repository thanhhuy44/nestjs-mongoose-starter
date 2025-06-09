import {
  Body,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { ParseObjectIdPipe } from '@/common/pipe/parse-object-id.pipe';

import { QueryDto } from '../common/dto/query.dto';
import { BaseService } from './base.service';

export class BaseController<T> {
  constructor(protected readonly service: BaseService<T>) {}

  @Post()
  async create(@Body() data: any) {
    return this.service.create(data);
  }

  @Get()
  async findAll(@Query() query: QueryDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id', ParseObjectIdPipe) id: string) {
    const result = await this.service.findOne(id);
    if (!result) throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    return result;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    const result = await this.service.update(id, data);
    if (!result) throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    return result;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.service.delete(id);
    if (!result) throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    return result;
  }
}
