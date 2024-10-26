import { DeletionStatus, User, UserModelType } from '../../domain/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { UserViewDto } from '../../api/view-dto/users.view-dto';
import { Injectable } from '@nestjs/common';

import { FilterQuery } from 'mongoose';
import { GetUsersQueryParams } from '../../api/input-dto/users.input-dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { NotFoundDomainException } from '../../../../core/exceptions/domain-exceptions';

//для примера инжектирования через токен
export interface IUserQueryRepository<TEntity, TQuery> {
  getByIdOrNotFoundFail(id: string): Promise<TEntity>;
  getAll(query: TQuery): Promise<PaginatedViewDto<TEntity[]>>;
}

@Injectable()
export class UsersQueryRepository
  implements IUserQueryRepository<UserViewDto, GetUsersQueryParams>
{
  constructor(
    @InjectModel(User.name)
    private UserModel: UserModelType,
  ) {}

  async getByIdOrNotFoundFail(id: string): Promise<UserViewDto> {
    const user = await this.UserModel.findOne({
      _id: id,
      deletionStatus: DeletionStatus.NotDeleted,
    });

    if (!user) {
      throw NotFoundDomainException.create('user not found');
    }

    return UserViewDto.mapToView(user);
  }

  async getAll(
    query: GetUsersQueryParams,
  ): Promise<PaginatedViewDto<UserViewDto[]>> {
    const filter: FilterQuery<User> = {
      $or: [
        { login: { $regex: query.searchLoginTerm || '', $options: 'i' } },
        { email: { $regex: query.searchEmailTerm || '', $options: 'i' } },
      ],
    };

    const users = await this.UserModel.find({
      ...filter,
      deletionStatus: DeletionStatus.NotDeleted,
    })
      .sort({ [query.sortBy]: query.sortDirection })
      .skip(query.calculateSkip())
      .limit(query.pageSize);

    const totalCount = await this.UserModel.countDocuments(filter);

    const items = users.map(UserViewDto.mapToView);

    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });
  }
}
