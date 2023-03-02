import { IsNotEmpty, Length } from 'class-validator';

import { IsPassword } from '@/common/constraints/password.constraint';
import { IsUnique } from '@/modules/database/constraint/unique.constraint';

import { User } from '../entities/user.entity';

export class CreateUserDto {
    @IsUnique(
        {
            entity: User,
            property: 'name',
            ignore: 'id',
        },
        { message: '用户名已存在' },
    )
    @IsNotEmpty()
    name: string;

    @Length(8, 50, {
        message: '密码长度不得少于$constraint1',
    })
    @IsPassword(5, { message: '密码必须由小写字母,大写字母,数字以及特殊字符组成' })
    readonly password!: string;
}
