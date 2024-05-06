export type ApiResponse = {
  statusCode: number;
  message: string;
  data: any;
  pagination?: {
    page: number;
    totalPages: number;
    pageSize: number;
  };
};
