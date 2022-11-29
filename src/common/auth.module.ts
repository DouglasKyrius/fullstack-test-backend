import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from './config.module';
import { UsersModule } from '@/users/users.module';
import { AuthService } from './auth/services/auth.service';
import { JwtStrategy } from './auth/services/jwt.strategy';

@Module({
  imports: [
    ConfigModule,
    forwardRef(() => UsersModule),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '6000s' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
