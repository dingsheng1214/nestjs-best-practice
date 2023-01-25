import { Exclude, Expose } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Exclude()
@Entity()
export class Article {
    @Expose()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Expose()
    @Column()
    title: string;

    @Expose()
    @Column()
    description?: string;

    // body字段只在article-detail组中显示
    @Expose({ groups: ['article-detail'] })
    @Column()
    body: string;

    @Expose()
    @Column({
        default: false,
    })
    published?: boolean;
}
