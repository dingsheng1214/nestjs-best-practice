import { ClassSerializerInterceptor, PlainLiteralObject, StreamableFile } from '@nestjs/common';
import { ClassTransformOptions } from '@nestjs/common/interfaces/external/class-transform-options.interface';
import { isObject, isArray } from 'class-validator';
import { isNil } from 'lodash';

/**
 * 全局响应拦截器
 */
export class AppIntercepter extends ClassSerializerInterceptor {
    serialize(
        response: PlainLiteralObject | Array<PlainLiteralObject>,
        options: ClassTransformOptions,
    ): PlainLiteralObject | PlainLiteralObject[] {
        let data: any;

        // 如果不是对象,不是数组, 不是流 则直接返回
        if ((!isObject(response) && !isArray(response)) || response instanceof StreamableFile) {
            data = response;
        }

        // 如果是数组,则遍历对每一项进行序列化
        if (isArray(response)) {
            data = (response as PlainLiteralObject[]).map((item) =>
                !isObject(item) ? item : this.transformToPlain(item, options),
            );
        }
        // 如果是分页数据,则对items中的每一项进行序列化
        if ('meta' in response && 'items' in response) {
            const items = !isNil(response.items) && isArray(response.items) ? response.items : [];
            data = {
                ...response,
                items: (items as PlainLiteralObject[]).map((item) => {
                    return !isObject(item) ? item : this.transformToPlain(item, options);
                }),
            };
        }
        // 如果响应是个对象则直接序列化
        data = this.transformToPlain(response, options);
        return { data, status: 0, extra: {}, message: 'success', success: true };
    }
}
