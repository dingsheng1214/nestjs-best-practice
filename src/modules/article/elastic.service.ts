import { WriteResponseBase } from '@elastic/elasticsearch/lib/api/types';
import { Inject, Injectable, Optional } from '@nestjs/common';

import { ElasticsearchService } from '@nestjs/elasticsearch';
import { instanceToPlain } from 'class-transformer';
import { pick } from 'lodash';

import { ArticleSearchBody } from '@/common/types';
import { Article } from '@/modules/article/entities/article.entity';

@Injectable()
export class SearchService {
    index = 'articles';

    @Optional()
    @Inject()
    private esService: ElasticsearchService;

    /**
     * 通过关键字搜索文章列表
     * @param 搜索条件{@link Article.title}, {@link Article.body}, {@link Category.nmae}
     * @returns 搜索结果{@link Article[]}
     */
    async search(text: string): Promise<Article[]> {
        const { hits } = await this.esService.search<Article>({
            index: this.index,
            query: {
                multi_match: {
                    query: text,
                    fields: ['title', 'body', 'categories'],
                },
            },
        });
        return hits.hits.map((item) => item._source);
    }

    /**
     * 当创建一篇文章时创建它的es索引
     * @param article
     */
    async create(article: Article): Promise<WriteResponseBase> {
        return this.esService.index<ArticleSearchBody>({
            index: this.index,
            document: {
                ...pick(instanceToPlain(article), ['id', 'title', 'body']),
                categories: (article.categories ?? []).join(','),
            },
        });
    }

    /**
     * 更新文章时更新它的es字段
     * @param article
     */
    async update(article: Article) {
        const newBody: ArticleSearchBody = {
            ...pick(instanceToPlain(article), ['title', 'body']),
            categories: (article.categories ?? []).join(','),
        };
        const script = Object.entries(newBody).reduce(
            (result, [key, value]) => `${result} ctx._source.${key}=>'${value}'`,
            '',
        );
        return this.esService.updateByQuery({
            index: this.index,
            query: { match: { id: article.id } },
            script,
        });
    }

    /**
     * 删除文章的同时在es中删除这篇文章
     * @param articleId {@link Article#id}
     */
    async remove(articleId: string) {
        return this.esService.deleteByQuery({
            index: this.index,
            query: { match: { id: articleId } },
        });
    }
}
