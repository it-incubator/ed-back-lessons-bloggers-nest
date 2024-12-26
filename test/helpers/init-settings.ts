import { getConnectionToken } from '@nestjs/mongoose';
import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { Connection } from 'mongoose';
import { appSetup } from '../../src/setup/app.setup';
import { UsersTestManager } from './users-test-manager';
import { deleteAllData } from './delete-all-data';
import { EmailService } from '../../src/features/notifications/email.service';
import { EmailServiceMock } from '../mock/email-service.mock';
import { CoreConfig } from '../../src/core/core.config';
import { initAppModule } from '../../src/init-app-module';

export const initSettings = async (
  //передаем callback, который получает ModuleBuilder, если хотим изменить настройку тестового модуля
  addSettingsToModuleBuilder?: (moduleBuilder: TestingModuleBuilder) => void,
) => {
  const dynamicAppModule = await initAppModule();
  const testingModuleBuilder: TestingModuleBuilder = Test.createTestingModule({
    imports: [dynamicAppModule],
  })

    .overrideProvider(EmailService)
    .useClass(EmailServiceMock);

  if (addSettingsToModuleBuilder) {
    addSettingsToModuleBuilder(testingModuleBuilder);
  }

  const testingAppModule = await testingModuleBuilder.compile();

  const app = testingAppModule.createNestApplication();
  const coreConfig = app.get<CoreConfig>(CoreConfig);
  await appSetup(app, coreConfig);

  await app.init();

  const databaseConnection = app.get<Connection>(getConnectionToken());
  const httpServer = app.getHttpServer();
  const userTestManger = new UsersTestManager(app);

  await deleteAllData(app);

  return {
    app,
    databaseConnection,
    httpServer,
    userTestManger,
  };
};
