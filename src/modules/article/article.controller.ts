import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseInterceptors,
    SerializeOptions,
} from '@nestjs/common';

import { BusinessException } from '@/common/filters/exceptions/business.exception';

import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { QueryArticleDto } from './dto/query-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@UseInterceptors()
@Controller('article')
export class ArticleController {
    constructor(private readonly articleService: ArticleService) {}

    @Post()
    create(@Body() createArticleDto: CreateArticleDto) {
        return this.articleService.create(createArticleDto);
    }

    @Get()
    findAll() {
        // throw new HttpException('hello', 200);
        throw new BusinessException('hello');
        return this.articleService.findAll();
    }

    @Post('query')
    query(@Body() queryDto: QueryArticleDto) {
        return this.articleService.query(queryDto);
    }

    @Get(':id')
    @SerializeOptions({ groups: ['article-detail'] })
    findOne(@Param('id') id: string) {
        return this.articleService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
        return this.articleService.update(+id, updateArticleDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.articleService.remove(+id);
    }
}
