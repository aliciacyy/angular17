import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { FrontendApi, Configuration, Session, Identity } from '@ory/client';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // private readonly kratosBaseUrl = 'https://getfromyourown.projects.oryapis.com';
  private readonly kratosBaseUrl = 'http://localhost:4000';
  private ory: FrontendApi;
  private session?: Session;
  private logoutUrl?: string;
  private token?: string;
  private httpService = inject(HttpService)

  constructor(private http: HttpClient) {
    this.ory = new FrontendApi(
      new Configuration({
        basePath: this.kratosBaseUrl,
        baseOptions: {
          withCredentials: true,
        },
      })
    );
  }

  // Initialize the session and get the logout URL
  initSession(): Promise<void> {
    return this.ory
      .toSession({
        tokenizeAs: 'jwt_example_template1',
      })
      .then(({ data }) => {
        this.session = data;
        this.token = this.session.tokenized;
        return this.ory.createBrowserLogoutFlow();
      })
      .then(({ data }) => {
        this.logoutUrl = data.logout_url;
      })
      .catch((err) => {
        console.error(err);
        window.location.replace(`${this.kratosBaseUrl}/ui/login`);
      });
  }

  // Check if the user is authenticated
  isAuthenticated(): Observable<boolean> {
    return this.http
      .get(`${this.kratosBaseUrl}/sessions/whoami`, { withCredentials: true })
      .pipe(
        map(() => true),
        catchError(() => of(false))
      );
  }

  // Redirect to Ory login page
  login(): void {
    window.location.href = `${this.kratosBaseUrl}/self-service/login/browser?return_to=http://localhost:4200/dashboard`;
  }

  // Log out the user
  logout(): void {
    if (this.logoutUrl) {
      window.location.href = this.logoutUrl;
    }
  }

  // Returns either the email or the username depending on the user's Identity Schema
  getUserName(): string | undefined {
    return (
      this.session?.identity?.traits.email ||
      this.session?.identity?.traits.username
    );
  }

  getUserId() {
    return this.session?.identity?.id ?? '';
  }

  getUserPerms(namespace: string, objectId: string) {
    return this.httpService.checkRelationTuple(namespace, objectId)
  }
}
