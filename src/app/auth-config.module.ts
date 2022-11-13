import { NgModule } from '@angular/core';
import { AuthInterceptor, AuthModule, LogLevel } from 'angular-auth-oidc-client';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
  imports: [
    AuthModule.forRoot({
      config: {
        authority: 'https://eval.iloveapi.management/v1/ip',
        redirectUrl: window.location.origin,
        postLogoutRedirectUri: window.location.origin,
        clientId: 'ezSgJFgfWk4twYjA04U2buMWObSXzp91XWO7pF5Q9VADy6Vm',
        scope: 'openid profile accounts:read accounts:balances:read',
        responseType: 'code',
        silentRenew: true,
        useRefreshToken: true,
        logLevel: LogLevel.Debug,
        customParamsCodeRequest: {
          scope: 'openid profile accounts:read accounts:balances:read',
        },
        customParamsAuthRequest: {
          audience: 'http://10.102.3.209',
          scope: 'openid profile accounts:read accounts:balances:read',
        },
        customParamsRefreshTokenRequest: {
          scope: 'openid profile accounts:read accounts:balances:read',
        },
        tokenRefreshInSeconds: 60,
        refreshTokenRetryInSeconds: 3,
        secureRoutes : ['/', '/home', 'https://eval.iloveapi.management/cymbal/v1/accounts'],
      },
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  exports: [AuthModule],
})
export class AuthConfigModule {}
