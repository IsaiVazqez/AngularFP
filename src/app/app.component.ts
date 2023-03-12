import { Component } from '@angular/core';
import { Product } from './models/product.model';
import { AuthService } from './services/auth.service';
import { FilesService } from './services/files.service';
import { UsersService } from './services/users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  imgParent = '';
  showImg = true;
  token = '';

  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private fileService: FilesService,
  ) {

  }

  onLoaded(img: string) {
    console.log('log padre', img);
  }
  toggleImg() {
    this.showImg = !this.showImg;
  }

  createUser() {
    this.usersService.create({
      name: 'Sebas',
      email: 'sebas@mail.com',
      password: '1212'
    })
    .subscribe(rta => {
      console.log(rta);
    });
  }

  login() {
    this.authService.login('sebas@mail.com', '1212')
    .subscribe(rta => {
      console.log(rta.access_token);
      this.token = rta.access_token;
    });
  }

  getProfile() {
    this.authService.getProfile()
    .subscribe(profile => {
      console.log(profile);
    });
  }

  downloadPdf() {
    this.fileService.getFile('my.pdf', 'Link De la direccion pdf', 'aplication/pdf' )
    .subscribe()
  }
}
