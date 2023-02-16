import { Controller, Query, Get, SerializeOptions } from '@nestjs/common';

import { BaseControllerWithTrash } from '@/common/controllers';
import { Crud } from '@/common/decorators/crud.decorator';

import { QueryCategoryTreeDto } from '@/modules/category/dto/query-category.tree.dto';

import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Crud({
    id: 'category',
    enabled: ['list', 'detail', 'store', 'update', 'delete', 'restore'],
    dtos: {
        store: CreateCategoryDto,
        update: UpdateCategoryDto,
    },
})
@Controller('category')
export class CategoryController extends BaseControllerWithTrash<CategoryService> {
    constructor(private readonly categoryService: CategoryService) {
        super(categoryService);
    }

    @Get('tree')
    @SerializeOptions({ groups: ['category-tree'] })
    async tree(@Query() queryDto: QueryCategoryTreeDto): Promise<Category[]> {
        return this.categoryService.findTrees(queryDto);
    }
}
