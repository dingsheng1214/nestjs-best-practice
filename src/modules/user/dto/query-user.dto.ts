import { IsEnum, IsOptional } from 'class-validator';

import { SelectTrashMode } from '@/modules/database/constant';

export class QueryPostDto {
    @IsEnum(SelectTrashMode)
    @IsOptional()
    trashed?: SelectTrashMode;
}
