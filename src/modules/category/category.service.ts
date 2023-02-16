import { Injectable } from '@nestjs/common';
import { isNil, omit } from 'lodash';
import { EntityNotFoundError } from 'typeorm';

import { BaseService } from '../database/base/service';
import { SelectTrashMode } from '../database/constant';

import { CategoryRepository } from './category.repository';

import { CreateCategoryDto } from './dto/create-category.dto';
import { QueryCategoryTreeDto } from './dto/query-category.tree.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService extends BaseService<Category, CategoryRepository> {
    constructor(protected readonly repository: CategoryRepository) {
        super(repository);
    }

    /**
     * 新增分类
     * @param data
     */
    async create(data: CreateCategoryDto) {
        const item = await this.repository.save({
            ...data,
            parent: await this.getParent(undefined, data.parent),
        });
        return item;
    }

    /**
     * 更新分类
     * @param data
     */
    async update(data: UpdateCategoryDto) {
        const querySet = omit(data, ['id', 'parent']);
        if (Object.keys(querySet).length > 0) {
            await this.repository.update(data.id, querySet);
        }
        const parent = await this.getParent(data.id, data.parent);
        const category = await this.detail(data.id);
        const shouldUpdateParent =
            (!isNil(category.parent) && !isNil(parent) && category.parent.id !== parent.id) ||
            (isNil(category.parent) && !isNil(parent)) ||
            (!isNil(category.parent) && isNil(parent));
        // 父分类单独更新
        if (parent !== undefined && shouldUpdateParent) {
            category.parent = parent;
            await this.repository.save(category);
        }
        return category;
    }

    /**
     * 查询分类树
     */
    async findTrees(data: QueryCategoryTreeDto) {
        const { trashed = SelectTrashMode.NONE } = data;
        return this.repository.findTrees({
            withTrashed: trashed === SelectTrashMode.ALL || trashed === SelectTrashMode.ONLY,
            onlyTrashed: trashed === SelectTrashMode.ONLY,
        });
    }

    /**
     * 获取请求传入的父分类
     * @param current 当前分类的ID
     * @param id
     */
    protected async getParent(current?: string, id?: string) {
        if (current === id) return undefined;
        let parent: Category | undefined;
        if (id !== undefined) {
            if (id === null) return null;
            parent = await this.repository.findOne({ where: { id } });
            if (!parent)
                throw new EntityNotFoundError(Category, `Parent category ${id} not exists!`);
        }
        return parent;
    }
}
