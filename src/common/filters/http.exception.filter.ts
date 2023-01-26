/* eslint-disable @typescript-eslint/dot-notation */
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

import Logger from '@/common/utils/Logger';

import { BusinessException } from './exceptions/business.exception';

/**
 * 捕获http异常(自定义异常如BusinessException)
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<FastifyReply>();
        const request = ctx.getRequest<FastifyRequest>();
        const status = exception.getStatus();

        const logFormat = `
    Request original url: ${request.url}
    Method: ${request.method}
    IP: ${request.ip}
    Response: ${JSON.stringify(exception.getResponse())} \n`;
        Logger.error(logFormat);

        if (exception instanceof BusinessException) {
            const error = exception.getResponse();
            response.status(HttpStatus.OK).send({
                status: error['code'],
                extra: {},
                message: error['message'],
                success: false,
            });
            return;
        }

        response.status(status).send({
            status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: exception.getResponse(),
        });
    }
}
