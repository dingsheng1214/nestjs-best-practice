import { Transform } from 'class-transformer';
import {
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsUUID,
    MaxLength,
    Min,
    ValidateIf,
} from 'class-validator';

import { toNumber } from 'lodash';

import { IsDataExist } from '@/modules/database/constraint/data.exist.constraint';
import { IsTreeUnique } from '@/modules/database/constraint/unique.tree.constraint';

import { Category } from '../entities/category.entity';

export class CreateCategoryDto {
    @IsTreeUnique(Category, {
        groups: ['create', 'update'],
        message: '分类名称重复',
    })
    @MaxLength(25, {
        always: true,
        message: '分类名称长度不得超过$constraint1',
    })
    @IsNotEmpty({ groups: ['create'], message: '分类名称不得为空' })
    @IsOptional({ groups: ['update'] })
    name!: string;

    @IsDataExist(Category, { always: true, message: '父分类不存在' })
    @IsUUID(undefined, { always: true, message: '父分类ID格式不正确' })
    @ValidateIf((value) => value.parent !== null && value.parent)
    @IsOptional({ always: true })
    @Transform(({ value }) => (value === 'null' ? null : value))
    parent?: string;

    @Transform(({ value }) => toNumber(value))
    @Min(0, { always: true, message: '排序值必须大于0' })
    @IsNumber(undefined, { always: true })
    @IsOptional({ always: true })
    order = 0;
}
