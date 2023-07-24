import { MailerModule } from '@mulailomba/mailer';
import { OrganizerModule } from '@mulailomba/organizer';
import { TokenModule } from '@mulailomba/token';
import { UserModule } from '@mulailomba/user';
import { Module, Provider } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoogleGuard, JwtAuthGuard, RoleGuard } from '../../common/src/guards';
import { FacebookGuard } from '../../common/src/guards/facebook.guard';
import { ACTIVATION_CODE_SERVICE, AUTH_SERVICE } from './constants';
import { AuthController, AuthFacebookController, AuthGoogleController } from './controllers';
import { TypeOrmAuthEntities } from './entities';
import { ActivationCodeService, AuthService } from './services';
import { FacebookStrategy, GoogleStrategy, JwtStrategy } from './strategies';

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
    UserModule,
    MailerModule,
    OrganizerModule,
    TokenModule,
  ],
  controllers: [AuthController, AuthGoogleController, AuthFacebookController],
  providers: [
    ...Services,
    JwtStrategy,
    GoogleStrategy,
    FacebookStrategy,
    JwtAuthGuard,
    RoleGuard,
    GoogleGuard,
    FacebookGuard,
  ],
  exports: [...Services],
})
export class CoreModule {}
