import { Exclude, Expose } from 'class-transformer';
import { Column, Entity, Index, ManyToMany, Tree, TreeChildren, TreeParent } from 'typeorm';

import { Article } from '@/modules/article/entities/article.entity';
import { BaseEntity } from '@/modules/database/base/entity';

@Exclude()
@Tree('materialized-path') // 物理路径
@Entity()
export class Category extends BaseEntity {
    @Expose()
    @Column({ comment: '分类名称' })
    @Index({ fulltext: true })
    name: string;

    @Expose()
    @Column({ comment: '分类排序', default: 0 })
    order: number;

    @Expose({ groups: ['category-detail', 'category-list'] })
    @TreeParent({ onDelete: 'NO ACTION' })
    parent: Category | null;

    @Expose({ groups: ['category-tree'] })
    @TreeChildren({ cascade: true })
    children: Category[];

    // 虚拟字段,查询分类的分页数据时用来代表分类的深度
    @Expose()
    depth = 0;

    @ManyToMany((type) => Article, (article: Article) => article.categories)
    articles!: Article[];
}
