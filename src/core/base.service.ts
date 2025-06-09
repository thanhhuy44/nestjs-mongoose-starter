import { Model, PopulateOptions } from 'mongoose';

import { AppCacheService } from '@/common/cache/app-cache.service';

import { QueryHelper, QueryOptions } from '../utils/query-helper';

export class BaseService<T> {
  constructor(
    protected readonly model: Model<T>,
    protected readonly cacheService: AppCacheService,
    private readonly populateOptions?:
      | string
      | PopulateOptions
      | (string | PopulateOptions)[],
  ) {}

  private buildCacheKey(prefix: string, data: any): string {
    return `${prefix}:${JSON.stringify(data)}`;
  }

  async create(data: any, createdBy?: string): Promise<T> {
    if (createdBy) data.createdBy = createdBy;
    return this.model.create(data);
  }

  async findAll(query: QueryOptions) {
    const helper = new QueryHelper(query);
    const filter = { ...helper.getFilter(), isDeleted: false }; // soft delete
    const sort = helper.getSort();
    const { limit, skip, page } = helper.getPagination();
    const projection = helper.getProjection();

    const key = this.buildCacheKey('findAll', {
      filter,
      sort,
      skip,
      limit,
      pagination: { page, limit },
      projection,
    });

    // Check cache first
    const cached = await this.cacheService.get(key);
    if (cached) {
      return cached;
    }

    const q = this.model
      .find(filter, projection)
      .sort(sort)
      .skip(skip)
      .limit(limit);
    if (this?.populateOptions) q.populate(JSON.stringify(this.populateOptions));

    const [items, total] = await Promise.all([
      q.exec(),
      this.model.countDocuments(filter),
    ]);

    const result = {
      items,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };

    await this.cacheService.set(key, result);

    return result;
  }

  async findOne(id: string): Promise<T | null> {
    const key = this.buildCacheKey('findOne', { id });
    const cached = await this.cacheService.get(key);
    if (cached) return cached as T;
    const query = this.model.findOne({ _id: id, isDeleted: false });
    if (this.populateOptions) query.populate(this.populateOptions as string);

    const result = await query.exec();
    if (result) await this.cacheService.set(key, result);

    return result;
  }

  async update(
    id: string,
    updateDto: any,
    updatedBy?: string,
  ): Promise<T | null> {
    if (updatedBy) updateDto.updatedBy = updatedBy;
    const result = await this.model
      .findOneAndUpdate({ _id: id, isDeleted: false }, updateDto, { new: true })
      .populate(JSON.stringify(this.populateOptions) || '')
      .exec();

    await this.cacheService.reset();

    return result;
  }

  async delete(id: string, deletedBy?: string): Promise<T | null> {
    const result = await this.model.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
        ...(deletedBy && { updatedBy: deletedBy }),
      },
      { new: true },
    );

    await this.cacheService.reset();

    return result;
  }
}
