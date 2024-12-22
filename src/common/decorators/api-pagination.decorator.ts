import {applyDecorators, BadRequestException, createParamDecorator, ExecutionContext} from '@nestjs/common';
import {plainToClass} from 'class-transformer';
import {validate} from 'class-validator';
import {ApiQuery} from '@nestjs/swagger';
import { PaginationDto } from '../dtos';

export const Pagination = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext): Promise<PaginationDto> => {
    const request = ctx.switchToHttp().getRequest()
    const {limit, page, sortBy, sortType} = request.query

    const paginationDto = plainToClass(PaginationDto, {
      limit: limit ? parseInt(limit, 10) : 10,
      page: page ? parseInt(page, 10) : 1,
      sortBy: sortBy || 'createdAt',
      sortType: sortType || 'desc',
    })

    const errors = await validate(paginationDto);
    if (errors.length > 0) {
      throw new BadRequestException('Invalid pagination parameters')
    }

    return paginationDto
  },
)

export function ApiPagination() {
  return applyDecorators(
    ApiQuery({name: 'page', required: false, type: Number, description: 'Page number of the pagination'}),
    ApiQuery({name: 'limit', required: false, type: Number, description: 'Number of items per page'}),
    ApiQuery({name: 'sortBy', required: false, type: String, description: 'Field to sort items'}),
    ApiQuery({name: 'sortType', required: false, type: String, description: 'Sorting direction, asc or desc'}),
  )
}