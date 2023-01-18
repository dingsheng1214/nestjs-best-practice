import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

import { AppModule } from '@/app.module';
import Logger from '@/common/utils/Logger';

import { LoggerMiddleware } from './common/middleware';

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

    // 中间件-log4js日志
    app.use(LoggerMiddleware);
    await app.listen(3000, '0.0.0.0');
    Logger.msg(`Application is running on: ${await app.getUrl()}`);
    Logger.msg(`Swagger is running on: ${await app.getUrl()}/api`);
    Logger.msg(`Current NODE_ENV: ${process.env.NODE_ENV}`);
}
bootstrap();
