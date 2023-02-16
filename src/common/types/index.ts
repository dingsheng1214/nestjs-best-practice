import { Article } from '@/modules/article/entities/article.entity';

export * from './crud';

/**
 * 全文搜索类型
 ** like: mysql like 实现全文搜索
 ** against: mysql against 实现全文搜索
 ** elastic: elastic search
 */
export type SearchType = 'like' | 'against' | 'elastic';
export interface ContentConfig {
    searchType?: SearchType;
}
/** 搜索结构体 */
export type ArticleSearchBody = Pick<ClassToPlain<Article>, 'title' | 'body'> & {
    categories: string;
};
