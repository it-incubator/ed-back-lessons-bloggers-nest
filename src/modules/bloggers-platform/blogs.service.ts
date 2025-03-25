import { Injectable } from '@nestjs/common';
import { UsersExternalQueryRepository } from '../user-accounts/infrastructure/external-query/users.external-query-repository';
import { UsersExternalService } from '../user-accounts/application/users.external-service';

@Injectable()
export class BlogsService {
  constructor(
    private usersExternalRepository: UsersExternalQueryRepository,
    private usersExternalService: UsersExternalService,
  ) {
    console.log('BlogsService crated');
  }
  async hello(id: string) {
    const user = await this.usersExternalRepository.getByIdOrNotFoundFail(id);

    return 'Hello World!';
  }
}
