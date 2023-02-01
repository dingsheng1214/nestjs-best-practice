import { Body, Controller, Get, Param, Post, Patch } from '@nestjs/common';

import { LoginDto } from './dto/login.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get(':name')
    findOne(@Param('name') name: string) {
        return this.userService.findByName(name);
    }

    @Post('login')
    login(@Body() loginDto: LoginDto) {
        return '';
    }

    @Patch()
    update(@Body() updateUserDto: UpdateUserDto) {
        return '';
    }
}
