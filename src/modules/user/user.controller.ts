import { Body, Controller, Get, Param, Post, Patch, Delete } from '@nestjs/common';

import { DeleteWithTrashDto, RestoreDto } from '@/common/dtos';

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

    @Delete()
    delete(@Body() deleteWithTrashDto: DeleteWithTrashDto) {
        const { ids, trash } = deleteWithTrashDto;
        return this.userService.delete(ids, trash);
    }

    @Patch('restore')
    restore(@Body() restoreDto: RestoreDto) {
        return this.userService.restore(restoreDto.ids);
    }
}
