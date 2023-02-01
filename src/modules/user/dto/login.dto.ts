import { IsNotEmpty, IsString, Length } from 'class-validator';

import { IsMatch } from '@/common/constraints/match.constraint';
import { IsPassword } from '@/common/constraints/password.constraint';
import { IsMatchPhone } from '@/common/constraints/phone.constraint';

export class LoginDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @Length(8, 50, {
        message: '密码长度不得少于$constraint1',
    })
    @IsPassword(5, { message: '密码必须由小写字母,大写字母,数字以及特殊字符组成' })
    readonly password!: string;

    @IsMatch('password', { message: '两次输入密码不同' })
    @IsNotEmpty({ message: '请再次输入密码以确认' })
    readonly plainPassword!: string;

    @IsMatchPhone(
        undefined,
        { strictMode: true },
        {
            message: '手机格式错误,示例: +86.15005255555',
        },
    )
    phone: string;
}
