export interface QueryOptions {
  search?: string;
  searchFields?: string[];
  sortBy?: string;
  page?: number;
  limit?: number;
  dateFrom?: string;
  dateTo?: string;
  fields?: string;
  [key: string]: any; // dynamic filters
}

export class QueryHelper {
  private readonly RESERVED_KEYS = [
    'search',
    'searchFields',
    'sortBy',
    'page',
    'limit',
    'dateFrom',
    'dateTo',
    'dateField',
    'fields',
  ];

  constructor(private query: QueryOptions) {}

  getFilter(): any {
    const filter: any = {};

    // === Search logic ===
    if (this.query.search && this.query.searchFields?.length) {
      const regex = new RegExp(this.query.search, 'i');
      filter.$or = this.query.searchFields.map((field) => ({
        [field]: regex,
      }));
    }

    // === Date range filter (createdAt) ===
    const dateField = this.query.dateField ?? 'createdAt';
    if (this.query.dateFrom || this.query.dateTo) {
      filter[dateField] = {};
      if (this.query.dateFrom) {
        filter[dateField].$gte = new Date(this.query.dateFrom);
      }
      if (this.query.dateTo) {
        filter[dateField].$lte = new Date(this.query.dateTo);
      }
    }

    // === Dynamic filters (status=active,pending | price[gte]=100) ===
    for (const key in this.query) {
      if (this.RESERVED_KEYS.includes(key)) continue;
      const value = this.query[key];

      // Nếu key dạng field[operator], ví dụ price[gte]
      const match = key.match(/^(.+)\[(gte|lte|gt|lt|ne)\]$/);
      if (match) {
        const [, field, operator] = match;
        if (!filter[field]) filter[field] = {};
        filter[field]['$' + operator] = this.parseValue(value);
        continue;
      }

      // Nếu value là mảng (dạng string ngăn cách bằng dấu phẩy)
      if (typeof value === 'string' && value.includes(',')) {
        filter[key] = { $in: value.split(',').map(this.parseValue) };
      } else {
        filter[key] = this.parseValue(value);
      }
    }

    return filter;
  }

  getSort(): Record<string, 1 | -1> {
    const sort: Record<string, 1 | -1> = {};
    if (this.query.sortBy) {
      this.query.sortBy.split(',').forEach((field) => {
        if (field.startsWith('-')) {
          sort[field.slice(1)] = -1;
        } else {
          sort[field] = 1;
        }
      });
    }
    return sort;
  }

  getPagination(): { limit: number; skip: number; page: number } {
    const limit = Math.max(1, Number(this.query.limit) || 10);
    const page = Math.max(1, Number(this.query.page) || 1);
    const skip = (page - 1) * limit;
    return { limit, skip, page };
  }

  getProjection(): Record<string, 1> | undefined {
    if (!this.query.fields) return undefined;
    const fields = this.query.fields.split(',');
    const projection: Record<string, 1> = {};
    fields.forEach((f) => (projection[f] = 1));
    return projection;
  }

  private parseValue(value: string): any {
    if (value === 'true') return true;
    if (value === 'false') return false;
    const num = Number(value);
    return isNaN(num) ? value : num;
  }
}
