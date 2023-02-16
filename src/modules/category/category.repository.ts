import { BaseTreeRepository } from '@/modules/database/base/tree.repository';
import { CustomRepository } from '@/modules/database/decorators/CustomRepository.decorator';

import { OrderType, TreeChildrenResolve } from '../database/constant';

import { Category } from './entities/category.entity';

@CustomRepository(Category)
export class CategoryRepository extends BaseTreeRepository<Category> {
    protected _qbName = 'category';

    protected orderBy = { name: 'order', order: OrderType.ASC };

    protected _childrenResolve = TreeChildrenResolve.UP;
}
