import { CustomRepository } from '@/modules/database/decorators/CustomRepository.decorator';

import { BaseRepository } from '../database/base/repository';

import { User } from './entities/user.entity';

@CustomRepository(User)
export class UserRepository extends BaseRepository<User> {
    protected _qbName = 'user';

    findByName(name: string) {
        return this.buildBaseQB().where('user.name = :name', { name }).getOne();
    }
}
