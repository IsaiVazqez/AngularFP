import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor(private auth: AuthService) { }

/*   loginUser(): void {
    const credentials: Credentials = {
      email: 'user@gmail.com',
      password: '123456',
    };
    this.auth.loginUser(credentials)
      .subscribe((res: Login) => {
        localStorage.setItem('platzi_token', res.access_token);
      });
  }
}
*/}
