import { Injectable } from '@nestjs/common';
import { UsersExternalQueryRepository } from '../user-accounts/infrastructure/external-query/users.external-query-repository';
import { UsersExternalService } from '../user-accounts/application/users.external-service';
import { Types } from 'mongoose';

@Injectable()
export class BlogsService {
  constructor(
    private usersExternalRepository: UsersExternalQueryRepository,
    private usersExternalService: UsersExternalService,
  ) {
    console.log('BlogsService crated');
  }
  async hello(id: Types.ObjectId): Promise<string> {
    const user = await this.usersExternalRepository.getByIdOrNotFoundFail(id);

    return 'Hello World!';
  }
}
