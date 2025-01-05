import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../user-accounts/infrastructure/users.repository';

@Injectable()
export class BlogsService {
  constructor(private usersRepository: UsersRepository) {
    console.log('BlogsService crated');
  }
  hello() {
    return 'Hello World!';
  }
}
