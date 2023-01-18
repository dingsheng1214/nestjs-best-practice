import { Injectable } from '@nestjs/common';

import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
    constructor(readonly userRepository: UserRepository) {}

    findByName(name: string) {
        return this.userRepository.findByName(name);
    }
}
