export interface PaginateOptions {
  page?: number
  limit?: number
  sort?: Record<string, 1 | -1>
  projection?: Record<string, 1 | 0>
}