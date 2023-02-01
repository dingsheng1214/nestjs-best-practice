import { IsOptional, IsUUID } from 'class-validator';

import { IsDataExist } from '@/modules/database/constraint/data.exist.constraint';

import { IsUnique } from '@/modules/database/constraint/unique.constraint';

import { User } from '../entities/user.entity';

export class UpdateUserDto {
    @IsDataExist(User, {
        message: '指定的用户不存在',
    })
    @IsUUID(undefined, { message: '用户ID格式错误' })
    @IsOptional()
    id: string;

    @IsUnique(
        {
            entity: User,
            property: 'name',
            ignore: 'id',
        },
        { message: '用户名已存在' },
    )
    name: string;
}
