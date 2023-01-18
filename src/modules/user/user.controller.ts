import { Controller, Get, Param } from '@nestjs/common';

import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get(':name')
    findOne(@Param('name') name: string) {
        return this.userService.findByName(name);
    }
}
