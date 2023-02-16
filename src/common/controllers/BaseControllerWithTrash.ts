import { Body, Param, ParseUUIDPipe, Query } from '@nestjs/common';

import { DeleteWithTrashDto, RestoreDto } from '../dtos';

import { ListWithTrashedQueryDto } from '../dtos/list-query.dto';

/**
 * 带软删除验证的控制器
 */
export abstract class BaseControllerWithTrash<Service> {
    protected constructor(private service: Service) {}

    async list(@Query() options: ListWithTrashedQueryDto, ...args: any[]) {
        return (this.service as any).paginate(options);
    }

    async detail(
        @Param('id', new ParseUUIDPipe())
        item: string,
        ...args: any[]
    ) {
        return (this.service as any).detail(item);
    }

    async store(
        @Body()
        data: any,
        ...args: any[]
    ) {
        return (this.service as any).create(data);
    }

    async update(
        @Body()
        data: any,
        ...args: any[]
    ) {
        return (this.service as any).update(data);
    }

    async delete(
        @Body()
        { ids, trash }: DeleteWithTrashDto,
        ...args: any[]
    ) {
        return (this.service as any).delete(ids, trash);
    }

    async restore(
        @Body()
        { ids }: RestoreDto,
        ...args: any[]
    ) {
        return (this.service as any).restore(ids);
    }
}
