import { SetMetadata } from '@nestjs/common';
import { ObjectType } from 'typeorm';

import { CUSTOM_REPOSITORY_METADATA } from '../constant';

/**
 * 自定义Repository
 * @param entity 关联的实体类
 */
export const CustomRepository = <T>(entity: ObjectType<T>): ClassDecorator =>
    SetMetadata(CUSTOM_REPOSITORY_METADATA, entity);
