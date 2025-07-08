import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  standalone: true,
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  username = '';
  password = '';
  error = '';

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    const payload = {
      user: {
        username: this.username,
        password: this.password
      }
    };

    this.http.post('http://localhost:3000/login', payload, { withCredentials: true }).subscribe({
      next: (res: any) => {
        console.log('Login successful', res);
        this.router.navigate(['/messages']);
      },
      error: (err) => {
        this.error = 'Login failed. Please check your credentials.';
      }
    });
  }
}