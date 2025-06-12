import { Document, FilterQuery, Model, PopulateOptions, UpdateQuery } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { IBaseRepository, PaginationResult, QueryOptions } from '@/common/interfaces/base-repository.interface';

@Injectable()
export abstract class BaseRepository<T extends Document> implements IBaseRepository<T> {
  constructor(protected readonly model: Model<T>) {}

  async create(data: Partial<T>): Promise<T> {
    const createdEntity = new this.model(data);
    return createdEntity.save();
  }

  async findAll(options: QueryOptions = {}): Promise<PaginationResult<T>> {
    const {
      page = 1,
      limit = 10,
      sort = '-createdAt',
      filter = {},
      select,
      populate,
    } = options;

    const skip = (page - 1) * limit;
    const query = this.model.find({ ...filter, isDeleted: false });

    if (select) {
      query.select(select);
    }

    if (populate) {
      query.populate(populate as PopulateOptions);
    }

    query.sort(sort).skip(skip).limit(limit);

    const [items, total] = await Promise.all([
      query.exec(),
      this.model.countDocuments({ ...filter, isDeleted: false }),
    ]);

    return {
      items,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<T | null> {
    return this.model.findOne({ _id: id, isDeleted: false } as FilterQuery<T>).exec();
  }

  async findByFilter(filter: FilterQuery<T>): Promise<T | null> {
    return this.model.findOne({ ...filter, isDeleted: false } as FilterQuery<T>).exec();
  }

  async update(id: string, data: UpdateQuery<T>): Promise<T | null> {
    return this.model
      .findOneAndUpdate(
        { _id: id, isDeleted: false } as FilterQuery<T>,
        data,
        { new: true, runValidators: true }
      )
      .exec();
  }

  async delete(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id).exec();
  }

  async softDelete(id: string): Promise<T | null> {
    return this.model
      .findByIdAndUpdate(
        id,
        { isDeleted: true, deletedAt: new Date() },
        { new: true }
      )
      .exec();
  }

  async count(filter: FilterQuery<T> = {}): Promise<number> {
    return this.model.countDocuments({ ...filter, isDeleted: false }).exec();
  }
}