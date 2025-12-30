import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString, IsInt, Min, Max, IsDateString } from 'class-validator';
import { ServiceRequestStatus } from '@prisma/client';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { IsValidSort } from '../../common/dto/sort.dto';

export class ListServiceRequestsDto extends PaginationDto {
  @ApiPropertyOptional({ enum: ServiceRequestStatus })
  @IsOptional()
  @IsEnum(ServiceRequestStatus)
  status?: ServiceRequestStatus;

  @ApiPropertyOptional({ description: 'Search query (searches title and description)' })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({ description: 'Minimum priority (0-5)' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(5)
  minPriority?: number;

  @ApiPropertyOptional({ description: 'Maximum priority (0-5)' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(5)
  maxPriority?: number;

  @ApiPropertyOptional({ description: 'Start date (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'End date (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Sort field and direction (e.g., createdAt:desc, priority:asc)',
    example: 'createdAt:desc',
  })
  @IsOptional()
  @IsString()
  @IsValidSort()
  sort?: string;
}
