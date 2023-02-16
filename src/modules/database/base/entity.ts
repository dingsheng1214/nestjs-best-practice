import { Expose } from 'class-transformer';
import { BaseEntity as TypeormBaseEntity, PrimaryGeneratedColumn } from 'typeorm';

export class BaseEntity extends TypeormBaseEntity {
    @Expose()
    @PrimaryGeneratedColumn('uuid')
    id: string;
}
