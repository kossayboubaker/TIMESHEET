import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';


interface Credentials {
  email: string;
  motdepasse: string;
}

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.css'],
  
})
export class ConnexionComponent {
  credentials: Credentials = {
    email: '',
    motdepasse: ''
  };

  constructor(private userService: AuthService, private router: Router) {}

  login() {
    this.userService.login(this.credentials).subscribe(
      response => {         
        alert(response.msg);
        this.router.navigate(['/userdash']);
      },
      error => {
          alert(error.error.err)
      }
    );
  }
}