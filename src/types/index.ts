export type ApiResponse = {
  statusCode: number;
  message: string;
  data: any;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
