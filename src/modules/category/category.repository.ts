import { unset, pick } from 'lodash';
import { FindOptionsUtils, FindTreeOptions, TreeRepository } from 'typeorm';

import { CustomRepository } from '@/modules/database/decorators/CustomRepository.decorator';

import { Category } from './entities/category.entity';

@CustomRepository(Category)
export class CategoryRepository extends TreeRepository<Category> {
    /**
     * 构建基础查询器
     */
    buildBaseQB() {
        return this.createQueryBuilder('category').leftJoinAndSelect('category.parent', 'parent');
    }

    /**
     * 查询顶级分类
     * @param options
     */
    findRoots(options?: FindTreeOptions) {
        const escapeAlias = (alias: string) => this.manager.connection.driver.escape(alias);
        const escapeColumn = (column: string) => this.manager.connection.driver.escape(column);
        const joinColumn = this.metadata.treeParentRelation!.joinColumns[0];
        const parentPropertyName = joinColumn.givenDatabaseName || joinColumn.databaseName;
        const qb = this.buildBaseQB().orderBy('category.customOrder', 'ASC');
        qb.where(`${escapeAlias('category')}.${escapeColumn(parentPropertyName)} IS NULL`);
        FindOptionsUtils.applyOptionsToTreeQueryBuilder(qb, pick(options, ['relations', 'depth']));
        return qb.getMany();
    }

    /**
     * 创建后代查询器
     * @param alias
     * @param closureTableAlias
     * @param entity
     */
    createDescendantsQueryBuilder(alias: string, closureTableAlias: string, entity: Category) {
        return super
            .createDescendantsQueryBuilder(alias, closureTableAlias, entity)
            .orderBy(`${alias}.customOrder`, 'ASC');
    }

    /**
     * 创建祖先查询器
     * @param alias
     * @param closureTableAlias
     * @param entity
     */
    createAncestorsQueryBuilder(alias: string, closureTableAlias: string, entity: Category) {
        return super
            .createAncestorsQueryBuilder(alias, closureTableAlias, entity)
            .orderBy(`${alias}.customOrder`, 'ASC');
    }

    /**
     * 打平并展开树
     * @param trees
     * @param depth
     */
    async toFlatTrees(trees: Category[], depth = 0, parent: Category | null = null) {
        const data: Omit<Category, 'children'>[] = [];
        for (const item of trees) {
            item.depth = depth;
            item.parent = parent;
            const { children } = item;
            unset(item, 'children');
            data.push(item);
            data.push(...(await this.toFlatTrees(children, depth + 1, item)));
        }
        return data as Category[];
    }
}
