import { IsEnum, IsOptional } from 'class-validator';

import { SelectTrashMode } from '@/modules/database/constant';

/**
 * 树形分类查询验证
 */
export class QueryCategoryTreeDto {
    @IsEnum(SelectTrashMode)
    @IsOptional()
    trashed?: SelectTrashMode;
}
