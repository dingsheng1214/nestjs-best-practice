import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import Logger from '../utils/Logger';

interface Response<T> {
    data: T;
}

@Injectable()
export class SerializationInterceptor<T> implements NestInterceptor<T, Response<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
        const req = context.switchToHttp().getRequest<Request>();
        Logger.info(`请求参数：${JSON.stringify(req.body)}`);
        return next.handle().pipe(
            map((data) => ({
                data,
                status: 0,
                extra: {},
                message: 'success',
                success: true,
            })),
        );
    }
}
