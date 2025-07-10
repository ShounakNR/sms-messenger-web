import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  standalone: true,
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  username = '';
  name = '';
  phone = '';
  password = '';
  error = '';
  isSignup = false;

  constructor(private http: HttpClient, private router: Router) {}

  toggleMode() {
    this.isSignup = !this.isSignup;
    this.error = '';
  }

  onSubmit() {

    this.error = '';

    const user: any = {
      password: this.password
    };

    if (this.isSignup) {
      user.name = this.name;
      user.phone_number = this.phone;
      user.username = this.username;
      user.password_confirmation = this.password;
    } else {
      user.username = this.username;
    }

    const payload = { user };

    const url = this.isSignup
      ? `${environment.apiUrl}/signup`
      : `${environment.apiUrl}/login`;

    this.http.post(`${url}`, payload, { observe: 'response' }).subscribe({
      next: (response) => {
        const token = response.headers.get('Authorization');
        if (token) {
          localStorage.setItem('jwt', token);
          console.log(localStorage)
          this.router.navigate(['/messages']);
        }
        console.log('Login in successful', token)
      },
      error: (err) => {
        this.error = 'Login failed. Please check your credentials.';
      }
    });
  }
}