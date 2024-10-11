import { Module } from '@nestjs/common';
import { AuthController } from './api/auth.controller';
import { SecurityDevicesController } from './api/security-devices.controller';

@Module({
  controllers: [AuthController, SecurityDevicesController],
})
export class AuthModule {}
