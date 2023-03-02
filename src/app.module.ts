import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { APP_INTERCEPTOR } from '@nestjs/core/constants';

import { getConfig } from '@/common/utils/config';

import { AuthModule } from '@/modules/auth/auth.module';

import { AppIntercepter } from './common/interceptors';
import { ArticleModule } from './modules/article/article.module';
import { CategoryModule } from './modules/category/category.module';
import DatabaseModule from './modules/database/database.module';
import { ElasticModule } from './modules/elastic/elastic.module';
import { UserModule } from './modules/user/user.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true, // 全局模块
            ignoreEnvFile: true, // 忽略.env相关配置文件
            load: [getConfig], // 读取自定义文件
        }),

        DatabaseModule.forRoot(),
        ElasticModule.forRoot(),
        UserModule,
        ArticleModule,
        CategoryModule,
        AuthModule,
    ],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: AppIntercepter,
        },
    ],
})
export class AppModule {}
