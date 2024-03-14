import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNumber, Min } from "class-validator";

export enum OrderByEnum {
  ID = 'id',
  PropertiesName = 'properties_name',
}

export enum SortByEnum {
  Asc = 'asc',
  Desc = 'desc',
}

export class FindGeoLocationDto {
  @ApiProperty({ description: 'type | geometry_type | properties_name', required: false })
  keyword: string;

  @ApiProperty({ description: 'id | properties_name', required: false })
  @IsEnum(OrderByEnum)
  order_by: OrderByEnum = OrderByEnum.ID;

  @ApiProperty({ description: 'asc | desc', required: false })
  @IsEnum(SortByEnum)
  sort_by: SortByEnum = SortByEnum.Desc;

  @ApiProperty({ description: 'Offset of data', required: false })
  offset: 0 | number = 0;

  @ApiProperty({ description: 'Limit of data', required: false })
  limit: 10 | number = 10;
}