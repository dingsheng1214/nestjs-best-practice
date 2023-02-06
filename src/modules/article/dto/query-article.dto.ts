import { IsOptional, MaxLength } from 'class-validator';

export class QueryArticleDto {
    @MaxLength(100, {
        always: true,
        message: '搜索字符长度不得超过$constraint1',
    })
    @IsOptional({ always: true })
    search: string;
}
