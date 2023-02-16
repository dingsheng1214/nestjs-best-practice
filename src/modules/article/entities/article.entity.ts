import { Exclude, Expose } from 'class-transformer';
import { Column, Entity, Index, JoinTable, ManyToMany } from 'typeorm';

import { Category } from '@/modules/category/entities/category.entity';
import { BaseEntity } from '@/modules/database/base/entity';

@Exclude()
@Entity()
export class Article extends BaseEntity {
    @Expose()
    @Column()
    @Index({ fulltext: true })
    title: string;

    @Expose()
    @Column()
    description?: string;

    // body字段只在article-detail组中显示
    @Expose({ groups: ['article-detail'] })
    @Column()
    @Index({ fulltext: true })
    body: string;

    @Expose()
    @Column({
        default: false,
    })
    published?: boolean;

    @ManyToMany((type) => Category, (category: Category) => category.articles, {
        cascade: true, // 级联
    })
    @JoinTable() // many-to-many 关系的拥有者
    categories: Category[];
}
