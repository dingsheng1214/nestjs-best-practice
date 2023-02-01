import { Type } from 'class-transformer';
import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    /**
     * deleteAt值为日期时,该值处于回收站中
     ** 调用{@link Repository#softRemove} 软删除, deleteAt值为日期
     ** {@link Repository#restore} 数据恢复, deleteAt值为null
     */
    @Type(() => Date)
    @DeleteDateColumn({ comment: '删除时间' })
    deletedAt: Date;
}
