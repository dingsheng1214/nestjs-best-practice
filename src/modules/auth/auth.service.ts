import { Injectable } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import { User } from '@/modules/user/entities/user.entity';

import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    async validateUser(username: string, pwd: string) {
        const user = await this.userService.findByName(username);
        if (user && user.password === pwd) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: User) {
        const payload = {
            username: user.name,
            sub: user.id,
        };
        return this.jwtService.sign(payload);
    }
}
