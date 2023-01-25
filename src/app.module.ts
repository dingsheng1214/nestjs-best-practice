import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { APP_INTERCEPTOR } from '@nestjs/core/constants';

import { getConfig } from '@/common/utils/config';

import { AppIntercepter } from './common/interceptors';
import { ArticleModule } from './modules/article/article.module';
import DatabaseModule from './modules/database/database.module';
import { UserModule } from './modules/user/user.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true, // 全局模块
            ignoreEnvFile: true, // 忽略.env相关配置文件
            load: [getConfig], // 读取自定义文件
        }),
        DatabaseModule.forRoot(),
        UserModule,
        ArticleModule,
    ],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: AppIntercepter,
        },
    ],
})
export class AppModule {}
