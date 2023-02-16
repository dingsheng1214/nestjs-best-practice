import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, Min } from 'class-validator';
import { toNumber } from 'lodash';

import { SelectTrashMode } from '@/modules/database/constant';
import { PaginateOptions, TrashedOptions } from '@/modules/database/types';

export class ListQueryDto implements PaginateOptions {
    @Transform(({ value }) => toNumber(value))
    @Min(1, { message: '当前页必须大于1' })
    @IsNumber()
    @IsOptional()
    page = 1;

    @Transform(({ value }) => toNumber(value))
    @Min(1, { message: '每页显示数据必须大于1' })
    @IsNumber()
    @IsOptional()
    limit = 10;
}

export class ListWithTrashedQueryDto extends ListQueryDto implements TrashedOptions {
    @IsEnum(SelectTrashMode)
    @IsOptional()
    trashed?: SelectTrashMode;
}
