export const CUSTOM_REPOSITORY_METADATA = 'CUSTOM_REPOSITORY_METADATA';
/**
 * 软删除数据查询类型
 */
export enum SelectTrashMode {
    /** 包含已软删除和未软删除的数据（同时查询正常数据和回收站中的数据） */
    ALL = 'all',
    /** 只包含软删除的数据 （只查询回收站中的数据） */
    ONLY = 'only',
    /** 只包含未软删除的数据 （只查询正常数据） */
    NONE = 'none',
}

/**
 * 排序方式
 */
export enum OrderType {
    ASC = 'ASC',
    DESC = 'DESC',
}

/**
 * 树形模型在删除父级后子级的处理方式
 */
export enum TreeChildrenResolve {
    DELETE = 'delete',
    UP = 'up',
    ROOT = 'root',
}
