import { Controller, Post, Request, UseGuards } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';

import { User } from '@/modules/user/entities/user.entity';
import { UserService } from '@/modules/user/user.service';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
    ) {}

    @UseGuards(AuthGuard('local'))
    @Post('login')
    async login(@Request() request: Request & { user: User }) {
        const { user } = request;
        const token = await this.authService.login(user as User);
        return token;
    }

    @Post('signup')
    signup() {
        return '这是注册接口';
    }
}
