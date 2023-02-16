import { Get, Type, Post, Patch, Delete, SerializeOptions } from '@nestjs/common';
import { ClassTransformOptions } from 'class-transformer';
import { isNil } from 'lodash';

import { BaseController, BaseControllerWithTrash } from '../controllers';
import type { CurdOptions } from '../types';

type TFunction = BaseController<any> | BaseControllerWithTrash<any>;
/**
 * 控制器上的CRUD装饰器
 * @param options - {@link CurdOptions}
 * @return - {@link ClassDecorator}
 */
export function Crud({ id, enabled, dtos }: CurdOptions) {
    return <T extends TFunction>(controllerClass: Type<T>) => {
        // 启用的CRUD方法
        const methods = enabled
            .map((value) => {
                // CrudMethod to CrudItem
                return typeof value === 'string' ? { name: value } : value;
            })
            .filter((value) => {
                // controller 已经定义delete时，crud则不会生成delete方法
                return isNil(
                    Reflect.getOwnPropertyDescriptor(controllerClass.prototype, value.name),
                );
            });

        // 添加控制器方法的具体实现,参数的DTO类型,方法及路径装饰器,序列化选项,是否允许匿名访问等metadata
        // 添加其它回调函数
        for (const { name, option = {} } of methods) {
            // 处理controller未继承 BaseController/BaseControllerWithTrash 的场景
            if (isNil(Reflect.getOwnPropertyDescriptor(controllerClass.prototype, name))) {
                const descriptor =
                    controllerClass instanceof BaseControllerWithTrash
                        ? Reflect.getOwnPropertyDescriptor(BaseControllerWithTrash.prototype, name)
                        : Reflect.getOwnPropertyDescriptor(BaseController.prototype, name);
                Reflect.defineProperty(controllerClass.prototype, name, {
                    ...descriptor,
                    async value(...args: any[]) {
                        return descriptor.value.apply(this, args);
                    },
                });
            }

            // 获取 参数类型元信息(design:paramtypes是reflect-metadata内置的 key)
            const propertyDescriptor = Reflect.getOwnPropertyDescriptor(
                controllerClass.prototype,
                name,
            );

            // 获取当前方法的参数原信息， store, update, list 方法需要传入dto
            const [, ...params] = Reflect.getMetadata(
                'design:paramtypes',
                controllerClass.prototype,
                name,
            );
            if (['store', 'update', 'list'].includes(name) && !isNil(dtos[name])) {
                Reflect.defineMetadata(
                    'design:paramtypes',
                    [dtos[name], ...params],
                    controllerClass.prototype,
                    name,
                );
            }

            // 封装 @SerializeOptions({ groups: ['category-tree'] })
            let serialize: ClassTransformOptions = {};
            if (isNil(option.serialize)) {
                if (['detail', 'store', 'update', 'delete', 'restore'].includes(name)) {
                    serialize = { groups: [`${id}-detail`] };
                } else if (['list'].includes(name)) {
                    serialize = { groups: [`${id}-list`] };
                }
            } else if (option.serialize === 'noGroup') {
                serialize = {};
            } else {
                serialize = option.serialize;
            }
            SerializeOptions(serialize)(controllerClass, name, propertyDescriptor);

            // 添加相应的路由装饰器， 等同于👇🏻
            // @Get('/:id')
            // public async get(@Param('id') id: string) {}
            switch (name) {
                case 'list':
                    Get()(controllerClass, name, propertyDescriptor);
                    break;
                case 'detail':
                    Get(':id')(controllerClass, name, propertyDescriptor);
                    break;
                case 'store':
                    Post()(controllerClass, name, propertyDescriptor);
                    break;
                case 'update':
                    Patch()(controllerClass, name, propertyDescriptor);
                    break;
                case 'delete':
                    Delete()(controllerClass, name, propertyDescriptor);
                    break;
                default:
                    break;
            }

            if (!isNil(option.hook)) option.hook(controllerClass, name);
        }
        return controllerClass;
    };
}
