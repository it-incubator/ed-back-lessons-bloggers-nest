import { IsString } from 'class-validator';
import { EnvironmentVariable } from './configuration';

export class DatabaseSettings {
  constructor(private environmentVariables: EnvironmentVariable) {}
  @IsString()
  DB_URL: string = this.environmentVariables.DB_URL;
}
