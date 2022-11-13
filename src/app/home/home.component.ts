import { Component, OnInit, Injectable } from '@angular/core';
import { OidcClientNotification, OidcSecurityService, OpenIdConfiguration, UserDataResult } from 'angular-auth-oidc-client';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
})
export class HomeComponent implements OnInit {
  configuration$: Observable<OpenIdConfiguration>;
  userDataChanged$: Observable<OidcClientNotification<any>>;
  userData$: Observable<UserDataResult>;
  accountData$: Array<Account>;
  isAuthenticated = false;
  private url = 'https://eval.iloveapi.management/cymbal/v1/accounts'

  constructor(
    public oidcSecurityService: OidcSecurityService, 
    private http: HttpClient) {

  }

  ngOnInit() {
    this.configuration$ = this.oidcSecurityService.getConfiguration();
    this.userData$ = this.oidcSecurityService.userData$;
    this.oidcSecurityService.isAuthenticated$.subscribe(({isAuthenticated}) => {
      this.isAuthenticated = isAuthenticated;
      if(this.isAuthenticated){
        this.getCustomerAccounts().subscribe(
          (response) => {
            this.accountData$ = response[0].accounts;
            this.accountData$.forEach(account => {
              this.getAccountBalance(account.accountId).subscribe((balance) => {
                account.balance = balance[0];
              });
            });
          },
          (error) => { console.log(error);}
        );
      }
    });
  }

  getCustomerAccounts() {
    console.log('getting accounts');
    return this.http.get<Array<Accounts>>(this.url);
  }

  getAccountBalance(account: string) {
    console.log('getting balance');
    return this.http.get<Array<Balance>>(this.url+'/'+account+'/balances');
  }

}

export interface Accounts {
  customer: string
  accounts: Array<Account>
}

export interface Account {
brandName: string
companyCnpj: string
type: string
subtype: string
currency: string
compeCode: string
branchCode: string
number: string
checkDigit: string
accountId: string
balance: Balance
}

export interface Balance {
  accuntId: string
  availableAmount: Amount
  blockedAmount: Amount
  automaticallyInvestedAmount: Amount
}

export interface Amount {
  amount: string
  currency: string
}