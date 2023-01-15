import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { getConfig } from '@/common/utils/config';

import DatabaseModule from '@/modules/database/database.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
    imports: [
        DatabaseModule,
        ConfigModule.forRoot({
            isGlobal: true, // 全局模块
            ignoreEnvFile: true, // 忽略.env相关配置文件
            load: [getConfig], // 读取自定义文件
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
