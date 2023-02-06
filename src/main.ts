import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

import { useContainer } from 'class-validator';

import { AppModule } from '@/app.module';
import { HttpExceptionFilter, BaseExceptionFilter } from '@/common/filters';
import { LoggerMiddleware } from '@/common/middleware';
import Logger from '@/common/utils/Logger';

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
    useContainer(app.select(AppModule), {
        fallbackOnErrors: true,
    });
    // 中间件-log4js日志
    app.use(LoggerMiddleware);
    // DTO入参校验
    app.useGlobalPipes(new ValidationPipe());
    // 过滤器-异常处理
    app.useGlobalFilters(new BaseExceptionFilter(), new HttpExceptionFilter());

    await app.listen(3000, '0.0.0.0');
    Logger.msg(`Application is running on: ${await app.getUrl()}`);
    Logger.msg(`Swagger is running on: ${await app.getUrl()}/api`);
    Logger.msg(`phpmyadmin is running on: http://localhost:8080`);
    Logger.msg(`kibana is running on: http://localhost:5601/app/dev_tools#/console`);
    Logger.msg(`Current NODE_ENV: ${process.env.NODE_ENV}`);
}
bootstrap();
