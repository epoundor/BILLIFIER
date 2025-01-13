import { Prisma } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import { IsOptional, IsNumber, IsEnum } from 'class-validator';
import { Injectable } from '@nestjs/common';
import { ApiPropertyOptional } from '@nestjs/swagger';

@Injectable()
export class BasePaginationQueryDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiPropertyOptional()
  skip?: number;

  /**
   * Limit
   * @default 6
   */
  @Expose()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiPropertyOptional()
  take?: number;

  /**
   * Page
   * @default 1
   */
  @Expose()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiPropertyOptional()
  page?: number;

  /**
   * Default, not applied when searching with "q"
   * @default desc
   */
  @Expose()
  @IsOptional()
  @IsEnum(Prisma.SortOrder)
  @ApiPropertyOptional({ enum: Prisma.SortOrder })
  sortOrder?: Prisma.SortOrder;

  /**
   * Default, not applied when searching with "q"
   * @default id
   */
  @Expose()
  @IsOptional()
  @ApiPropertyOptional()
  sortBy?: string;
}
