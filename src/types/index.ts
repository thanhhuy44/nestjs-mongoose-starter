export type ApiResponse<T> = {
  timestamp: number;
  statusCode: number;
  message: string;
  data: T | null;
  error?: string;
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
