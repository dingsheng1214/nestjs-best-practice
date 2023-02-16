import { isNil } from 'lodash';
import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

import { OrderQueryType, PaginateOptions, PaginateReturn } from './types';

/**
 * 为查询添加排序,默认排序规则为DESC
 * @param qb 原查询 {@link SelectQueryBuilder}
 * @param alias 别名{@link string}
 * @param orderBy 查询排序{@link OrderQueryType}
 */
export const getOrderByQuery = <E extends ObjectLiteral>(
    qb: SelectQueryBuilder<E>,
    alias: string,
    orderBy?: OrderQueryType,
) => {
    if (isNil(orderBy)) return qb;
    if (typeof orderBy === 'string') return qb.orderBy(`${alias}.${orderBy}`, 'DESC');
    if (Array.isArray(orderBy)) {
        const i = 0;
        for (const item of orderBy) {
            if (i === 0) {
                typeof item === 'string'
                    ? qb.orderBy(`${alias}.${item}`, 'DESC')
                    : qb.orderBy(`${alias}.${item}`, item.order);
            } else {
                typeof item === 'string'
                    ? qb.addOrderBy(`${alias}.${item}`, 'DESC')
                    : qb.addOrderBy(`${alias}.${item}`, item.order);
            }
        }
        return qb;
    }
    return qb.orderBy(`${alias}.${(orderBy as any).name}`, (orderBy as any).order);
};

/**
 * 分页函数
 * @param qb queryBuilder实例
 * @param options 分页选项
 */
export const paginate = async <E extends ObjectLiteral>(
    qb: SelectQueryBuilder<E>,
    options: PaginateOptions,
): Promise<PaginateReturn<E>> => {
    const start = options.page > 0 ? options.page - 1 : 0;
    const totalItems = await qb.getCount();
    qb.take(options.limit).skip(start * options.limit);
    const items = await qb.getMany();
    const totalPages = Math.ceil(totalItems / options.limit);
    const itemCount =
        // eslint-disable-next-line no-nested-ternary
        options.page < totalPages ? options.limit : options.page === totalPages ? totalItems : 0;
    return {
        items,
        meta: {
            totalItems,
            itemCount,
            perPage: options.limit,
            totalPages,
            currentPage: options.page,
        },
    };
};
/**
 * 数据手动分页函数
 * @param options 分页选项
 * @param data 数据列表
 */
export function manualPaginate<E extends ObjectLiteral>(
    options: PaginateOptions,
    data: E[],
): PaginateReturn<E> {
    const { page, limit } = options;
    let items: E[] = [];
    const totalItems = data.length;
    const totalRst = totalItems / limit;
    const totalPages =
        totalRst > Math.floor(totalRst) ? Math.floor(totalRst) + 1 : Math.floor(totalRst);
    let itemCount = 0;
    if (page <= totalPages) {
        itemCount = page === totalPages ? totalItems - (totalPages - 1) * limit : limit;
        const start = (page - 1) * limit;
        items = data.slice(start, start + itemCount);
    }
    return {
        meta: {
            itemCount,
            totalItems,
            perPage: limit,
            totalPages,
            currentPage: page,
        },
        items,
    };
}
