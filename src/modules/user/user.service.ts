import { Injectable } from '@nestjs/common';
import { isNil } from 'lodash';
import { In } from 'typeorm';

import { CreateUserDto } from '@/modules/user/dto/create-user.dto';

import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
    constructor(readonly userRepository: UserRepository) {}

    findByName(name: string) {
        return this.userRepository.findByName(name);
    }

    async create(createUserDto: CreateUserDto) {
        return this.userRepository.save(createUserDto);
    }

    /**
     * 批量删除用户
     * @param ids
     */
    async delete(ids: string[], trash: boolean) {
        const users = await this.userRepository.find({ where: { id: In(ids) }, withDeleted: true });
        if (trash) {
            // 回收站中的直接删除
            const directs = users.filter((item) => !isNil(item.deletedAt));
            // 不在回收站中的丢到垃圾站中
            const softs = users.filter((item) => isNil(item.deletedAt));
            return [
                ...(await this.userRepository.remove(directs)),
                ...(await this.userRepository.softRemove(softs)),
            ];
        }
        return this.userRepository.remove(users);
    }

    async restore(ids: string[]) {
        const users = await this.userRepository.find({ where: { id: In(ids) }, withDeleted: true });
        // 过滤出不在回收站中的用户ID
        const trashedUserIds = users
            .filter((item) => !isNil(item.deletedAt))
            .map((item) => item.id);
        if (trashedUserIds.length <= 0) return [];
        return this.userRepository.restore(trashedUserIds);
    }
}
