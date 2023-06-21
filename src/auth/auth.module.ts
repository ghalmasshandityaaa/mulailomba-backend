import { MailerModule } from '@mulailomba/mailer';
import { OrganizerModule } from '@mulailomba/organizer';
import { UserModule } from '@mulailomba/user';
import { Module, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ACTIVATION_CODE_SERVICE, AUTH_SERVICE } from './constants';
import { AuthController, AuthGoogleController } from './controllers';
import { TypeOrmAuthEntities } from './entities';
import { GoogleGuard, JwtAuthGuard, RoleGuard } from './guard';
import { ActivationCodeService, AuthService } from './services';
import { GoogleStrategy, JwtStrategy } from './strategies';

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
    TypeOrmModule.forFeature(TypeOrmAuthEntities),
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
  controllers: [AuthController, AuthGoogleController],
  providers: [...Services, JwtStrategy, GoogleStrategy, JwtAuthGuard, RoleGuard, GoogleGuard],
  exports: [...Services],
})
export class AuthModule {}
