import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

/**
 * jwt策略：验证jwt是否存在
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private readonly configService: ConfigService) {
        super({
            // 提供从请求中提取 JWT 的方法
            // 从 Authorization: Bearer JWT_TOKEN 请求头中提取
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            // 如果我们的路由提供了一个过期的 JWT ，请求将被拒绝，并发送 401 未经授权的响应。Passport 会自动为我们办理
            ignoreExpiration: false,
            secretOrKey: configService.get('app_config').jwtSecret,
        });
    }

    async validate(payload: any) {
        return { userId: payload.sub, username: payload.username };
    }
}
