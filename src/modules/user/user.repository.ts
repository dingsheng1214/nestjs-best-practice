import { Repository } from 'typeorm';

import { CustomRepository } from '@/modules/database/decorators/CustomRepository.decorator';

import { User } from './entities/user.entity';

@CustomRepository(User)
export class UserRepository extends Repository<User> {
    findByName(name: string) {
        return this.createQueryBuilder('user').where('user.name = :name', { name }).getOne();
    }
}
