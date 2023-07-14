import { UserModule } from '@mulailomba/user';
import { Module, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { TOKEN_SERVICE } from './constants';
import { TokenService } from './services';

const Services: Provider<any>[] = [
  {
    provide: TOKEN_SERVICE,
    useClass: TokenService,
  },
];

const Repositories = [];

@Module({
  imports: [
    CqrsModule,
    ConfigModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: configService.get<string>('JWT_EXPIRATION_TIME'),
          },
          global: true,
        };
      },
      inject: [ConfigService],
    }),
    UserModule,
  ],
  providers: [...Services, ...Repositories],
  exports: [...Services],
})
export class TokenModule {}
