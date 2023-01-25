import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';

@Injectable()
export class ArticleService {
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>;

    create(createArticleDto: CreateArticleDto) {
        return this.articleRepository.save(createArticleDto);
    }

    findAll() {
        return this.articleRepository.find();
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
