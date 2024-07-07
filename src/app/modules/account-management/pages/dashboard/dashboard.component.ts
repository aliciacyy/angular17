import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit  {

  authService = inject(AuthService);
  username = '';

  ngOnInit() {
    this.authService.initSession()
    .then(() => {
      this.username = this.authService.getUserName() ?? '';
      this.authService.getUserPerms('User', this.authService.getUserId()).then((a) => {
        console.log(a);
      });
    })
    .catch(err => console.error(err));
  }

  logout = () => {
    this.authService.logout();
  }
}
