import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * 扩展守卫
 * 扩展默认的错误处理
 * @link  https://docs.nestjs.cn/9/security?id=%e6%89%a9%e5%b1%95%e5%ae%88%e5%8d%ab
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext) {
        // 在这里添加自定义的认证逻辑
        // 例如调用 super.logIn(request) 来建立一个session
        return super.canActivate(context);
    }

    handleRequest(err, user, info) {
        // 可以抛出一个基于info或者err参数的异常
        if (err || !user) {
            throw err || new UnauthorizedException('jwt 鉴权失败');
        }
        return user;
    }
}
