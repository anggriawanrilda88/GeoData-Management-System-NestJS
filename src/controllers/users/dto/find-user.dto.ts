import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNumber, Min } from "class-validator";

export enum OrderByEnum {
  Name = 'name',
  Email = 'email',
}

export enum SortByEnum {
  Asc = 'asc',
  Desc = 'desc',
}

export class FindUserDto {
  @ApiProperty({ description: 'name | address | email', required: false })
  keyword: string;

  @ApiProperty({ description: 'name | email', required: false })
  @IsEnum(OrderByEnum)
  order_by: OrderByEnum = OrderByEnum.Name;

  @ApiProperty({ description: 'asc | desc', required: false })
  @IsEnum(SortByEnum)
  sort_by: SortByEnum = SortByEnum.Desc;

  @ApiProperty({ description: 'Offset of data', required: false })
  offset: 0 | number = 0;

  @ApiProperty({ description: 'Limit of data', required: false })
  limit: 10 | number = 10;
}