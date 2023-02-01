import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

import { DeleteDto } from './delete.dto';
/**
 * 带软删除的批量删除
 */
export class DeleteWithTrashDto extends DeleteDto {
    @Transform(({ value }) => Boolean(value))
    @IsBoolean()
    @IsOptional()
    trash?: boolean;
}
