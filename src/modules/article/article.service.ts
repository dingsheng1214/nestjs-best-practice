import { Inject, Injectable, Optional } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import Logger from '@/common/utils/Logger';
import { SearchService } from '@/modules/article/elastic.service';

import { CreateArticleDto } from './dto/create-article.dto';
import { QueryArticleDto } from './dto/query-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';

@Injectable()
export class ArticleService {
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>;

    @Optional()
    @Inject()
    private readonly searchService: SearchService;

    @Inject()
    private readonly configService: ConfigService;

    async create(createArticleDto: CreateArticleDto) {
        const article = await this.articleRepository.save(createArticleDto);
        if (this.searchService) {
            this.searchService.create(article);
        }
        return article;
    }

    findAll() {
        return this.articleRepository.find();
    }

    async query({ search }: QueryArticleDto) {
        const { searchType = 'against' } = this.configService.get('app_config');
        if (searchType === 'elastic') {
            // ElasticSearch 全文搜索
            const result = await this.searchService.search(search);
            Logger.info(result);
            const ids = result.map((item) => item.id);
            const articles = await this.articleRepository.find({ where: { id: In(ids) } });
            return articles;
        }
        const queryBuilder = this.articleRepository
            .createQueryBuilder('article')
            .leftJoinAndSelect('article.categories', 'category');
        if (searchType === 'like') {
            queryBuilder
                .andWhere('title LIKE :title', { title: `%${search}%` })
                .orWhere('body LIKE :body', { body: `%${search}%` })
                .orWhere('category.name LIKE :categoryName', { categoryName: `${search}` });
        } else if (searchType === 'against') {
            queryBuilder
                .andWhere('MATCH(title) AGAINST (:title IN BOOLEAN MODE)', {
                    title: `${search}*`,
                })
                .orWhere('MATCH(body) AGAINST (:body IN BOOLEAN MODE)', {
                    body: `${search}*`,
                })
                .orWhere('MATCH(category.name) AGAINST (:categoryName IN BOOLEAN MODE)', {
                    categoryName: `${search}*`,
                });
        }
        const articles = await queryBuilder.getMany();
        return articles;
    }

    findOne(id: string) {
        return this.articleRepository.findOneBy({ id });
    }

    update(id: number, updateArticleDto: UpdateArticleDto) {
        return `This action updates a #${id} article`;
    }

    remove(id: number) {
        return `This action removes a #${id} article`;
    }
}
