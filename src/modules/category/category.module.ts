import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Category } from '@/modules/category/entities/category.entity';
import DatabaseModule from '@/modules/database/database.module';

import { CategoryController } from './category.controller';
import { CategoryRepository } from './category.repository';
import { CategoryService } from './category.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Category]),
        DatabaseModule.forRepository([CategoryRepository]),
    ],
    controllers: [CategoryController],
    providers: [CategoryService],
})
export class CategoryModule {}
