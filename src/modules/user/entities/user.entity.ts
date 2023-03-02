import { Type } from 'class-transformer';
import { Column, DeleteDateColumn, Entity } from 'typeorm';

import { BaseEntity } from '@/modules/database/base/entity';

@Entity()
export class User extends BaseEntity {
    @Column()
    name: string;

    @Column()
    password: string;

    /**
     * deleteAt值为日期时,该值处于回收站中
     *  - Repository.softRemove 软删除 deleteAt值为日期
     *  - Repository#restore 数据恢复 deleteAt值为null
     */
    @Type(() => Date)
    @DeleteDateColumn({ comment: '删除时间' })
    deletedAt: Date;
}
