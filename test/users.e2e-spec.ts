import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { UsersTestManager } from './helpers/users-test-manager';
import { initSettings } from './helpers/init-settings';
import { CreateUserDto } from '../src/features/user-accounts/dto/create-user.dto';
import { deleteAllData } from './helpers/delete-all-data';
import { PaginatedViewDto } from '../src/core/dto/base.paginated.view-dto';
import {
  MeViewDto,
  UserViewDto,
} from '../src/features/user-accounts/api/view-dto/users.view-dto';
import { GLOBAL_PREFIX } from '../src/setup/global-prefix.setup';
import { JwtService } from '@nestjs/jwt';
import { delay } from './helpers/delay';
import { EmailService } from '../src/features/notifications/email.service';

describe('users', () => {
  let app: INestApplication;
  let userTestManger: UsersTestManager;

  beforeAll(async () => {
    const result = await initSettings((moduleBuilder) =>
      moduleBuilder.overrideProvider(JwtService).useValue(
        new JwtService({
          secret: 'access-token-secret', //TODO: move to env. will be in the following lessons
          signOptions: { expiresIn: '2s' },
        }),
      ),
    );
    app = result.app;
    userTestManger = result.userTestManger;
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await deleteAllData(app);
  });

  it('should create user', async () => {
    const body: CreateUserDto = {
      login: 'name1',
      password: 'qwerty',
      email: 'email@email.em',
    };

    const response = await userTestManger.createUser(body);

    expect(response).toEqual({
      login: body.login,
      email: body.email,
      id: expect.any(String),
      createdAt: expect.any(String),
      firstName: expect.any(String),
      lastName: expect.any(String),
    });
  });

  it('should get users with paging', async () => {
    const users = await userTestManger.createSeveralUsers(12);
    const { body: responseBody } = (await request(app.getHttpServer())
      .get(`/${GLOBAL_PREFIX}/users?pageNumber=2&sortDirection=asc`)
      .auth('admin', 'qwerty')
      .expect(HttpStatus.OK)) as { body: PaginatedViewDto<UserViewDto> };

    expect(responseBody.totalCount).toBe(12);
    expect(responseBody.items).toHaveLength(2);
    expect(responseBody.pagesCount).toBe(2);
    //asc sorting
    expect(responseBody.items[1]).toEqual(users[users.length - 1]);
    //etc...
  });

  it('should return users info while "me" request with correct accessTokens', async () => {
    const tokens = await userTestManger.createAndLoginSeveralUsers(1);

    const responseBody = await userTestManger.me(tokens[0].accessToken);

    expect(responseBody).toEqual({
      login: expect.anything(),
      userId: expect.anything(),
      email: expect.anything(),
    } as MeViewDto);
  });

  it(`shouldn't return users info while "me" request if accessTokens expired`, async () => {
    const tokens = await userTestManger.createAndLoginSeveralUsers(1);
    await delay(2000);
    await userTestManger.me(tokens[0].accessToken, HttpStatus.UNAUTHORIZED);
  });

  it(`should register user without really send email`, async () => {
    await request(app.getHttpServer())
      .post(`/${GLOBAL_PREFIX}/auth/registration`)
      .send({
        email: 'email@email.em',
        password: '123123123',
        login: 'login123',
      } as CreateUserDto)
      .expect(HttpStatus.CREATED);
  });

  it(`should call email sending method while registration`, async () => {
    const sendEmailMethod = (app.get(EmailService).sendConfirmationEmail = jest
      .fn()
      .mockImplementation(() => Promise.resolve()));

    await request(app.getHttpServer())
      .post(`/${GLOBAL_PREFIX}/auth/registration`)
      .send({
        email: 'email@email.em',
        password: '123123123',
        login: 'login123',
      } as CreateUserDto)
      .expect(HttpStatus.CREATED);

    expect(sendEmailMethod).toHaveBeenCalled();
  });
});
