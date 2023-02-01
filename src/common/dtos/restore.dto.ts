import { IsDefined, IsUUID } from 'class-validator';

/**
 * 批量恢复
 */
export class RestoreDto {
    @IsUUID(undefined, { each: true, message: 'ID格式错误' })
    @IsDefined({ each: true, message: 'ID必须指定' })
    ids: string[] = [];
}
