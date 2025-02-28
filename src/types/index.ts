export type ApiResponse = {
  statusCode: number;
  message: string;
  data: any;
  pagination?: Pagination;
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export enum EUserRole {
  SUPERADMIN = 'super_admin',
  ADMIN = 'admin',
  USER = 'user',
}

export enum ESortDirection {
  ASC = 'asc',
  DESC = 'desc',
}
