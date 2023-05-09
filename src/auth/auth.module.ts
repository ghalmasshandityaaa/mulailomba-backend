import { MailerModule } from '@aksesaja/mailer';
import { OrganizerModule } from '@aksesaja/organizer';
import { UserModule } from '@aksesaja/user';
import { Module, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ACTIVATION_CODE_SERVICE, AUTH_SERVICE } from './constants';
import { AuthController } from './controllers';
import { JwtAuthGuard, RoleGuard } from './guard';
import { ActivationCodeService, AuthService } from './services';
import { JwtStrategy } from './strategies';

const Services: Provider<any>[] = [
  {
    provide: AUTH_SERVICE,
    useClass: AuthService,
  },
  {
    provide: ACTIVATION_CODE_SERVICE,
    useClass: ActivationCodeService,
  },
];

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: configService.get<string>('JWT_EXPIRATION_TIME'),
          },
        };
      },
      inject: [ConfigService],
    }),
    UserModule,
    MailerModule,
    OrganizerModule,
  ],
  controllers: [AuthController],
  providers: [...Services, JwtStrategy, JwtAuthGuard, RoleGuard],
  exports: [...Services],
})
export class AuthModule {}
