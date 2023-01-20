import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateArticleDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    title: string;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    @MaxLength(300)
    description?: string;

    @IsString()
    @IsNotEmpty()
    body: string;

    @IsBoolean()
    @IsOptional()
    published?: boolean = false;
}
