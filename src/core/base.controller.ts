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
  Type,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { ParseObjectIdPipe } from '@/common/pipe/parse-object-id.pipe';
import { QueryDto } from '../common/dto/query.dto';
import { IBaseService } from '@/common/interfaces/base-service.interface';
import { PaginationResult } from '@/common/interfaces/base-repository.interface';

export interface BaseControllerOptions<CreateDto, UpdateDto> {
  createDto?: Type<CreateDto>;
  updateDto?: Type<UpdateDto>;
}

export function BaseControllerFactory<T, CreateDto = any, UpdateDto = any>(
  options?: BaseControllerOptions<CreateDto, UpdateDto>,
): Type<IBaseController<T, CreateDto, UpdateDto>> {
  class BaseControllerHost implements IBaseController<T, CreateDto, UpdateDto> {
    constructor(protected readonly service: IBaseService<T>) {}

    @Post()
    @ApiOperation({ summary: 'Create a new record' })
    @ApiResponse({ status: 201, description: 'Record created successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    async create(@Body() createDto: CreateDto): Promise<T> {
      try {
        return await this.service.create(createDto as any);
      } catch (error) {
        throw new HttpException(
          error.message || 'Failed to create record',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    @Get()
    @ApiOperation({ summary: 'Get all records with pagination' })
    @ApiResponse({ status: 200, description: 'Records retrieved successfully' })
    async findAll(@Query() query: QueryDto): Promise<PaginationResult<T>> {
      return await this.service.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a record by ID' })
    @ApiResponse({ status: 200, description: 'Record found' })
    @ApiResponse({ status: 404, description: 'Record not found' })
    async findOne(@Param('id', ParseObjectIdPipe) id: string): Promise<T> {
      const result = await this.service.findOne(id);
      if (!result) {
        throw new HttpException('Record not found', HttpStatus.NOT_FOUND);
      }
      return result;
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a record' })
    @ApiResponse({ status: 200, description: 'Record updated successfully' })
    @ApiResponse({ status: 404, description: 'Record not found' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    async update(
      @Param('id', ParseObjectIdPipe) id: string,
      @Body() updateDto: UpdateDto,
    ): Promise<T> {
      const result = await this.service.update(id, updateDto as any);
      if (!result) {
        throw new HttpException('Record not found', HttpStatus.NOT_FOUND);
      }
      return result;
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a record' })
    @ApiResponse({ status: 200, description: 'Record deleted successfully' })
    @ApiResponse({ status: 404, description: 'Record not found' })
    async remove(@Param('id', ParseObjectIdPipe) id: string): Promise<T> {
      const result = await this.service.remove(id);
      if (!result) {
        throw new HttpException('Record not found', HttpStatus.NOT_FOUND);
      }
      return result;
    }
  }

  return BaseControllerHost;
}

export interface IBaseController<T, CreateDto = any, UpdateDto = any> {
  create(createDto: CreateDto): Promise<T>;
  findAll(query: QueryDto): Promise<PaginationResult<T>>;
  findOne(id: string): Promise<T>;
  update(id: string, updateDto: UpdateDto): Promise<T>;
  remove(id: string): Promise<T>;
}

// For backward compatibility
export abstract class BaseController<T> extends BaseControllerFactory<T>() {}
