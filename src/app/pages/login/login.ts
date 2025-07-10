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
  formErrors: { phone?: string } = {};

  constructor(private http: HttpClient, private router: Router) {}

  toggleMode() {
    this.isSignup = !this.isSignup;
    this.error = '';
    this.formErrors = {};
  }

  onSubmit() {

    this.error = '';
    this.formErrors = {};

    const user: any = {
      password: this.password
    };

    if (this.isSignup) {
      if (!this.phone.trim()) {
        this.formErrors.phone = 'Phone number cannot be blank.';
        return;
      } else if (!/^\+1\d{10}$/.test(this.phone)){
        this.formErrors.phone = 'Phone number must be in format like +1234567890.';
        return;
      }
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
        if (!this.isSignup && token) {
          localStorage.setItem('jwt', token);
          console.log(localStorage)
          this.router.navigate(['/messages']);
        }

        if (this.isSignup) {
          alert('Signed up successfully!')
          this.isSignup =  false
          this.name = '';
          this.phone = '';
          this.password = '';
        }
      },
      error: (err) => {
        this.error = this.isSignup
          ? 'Signup failed. Please try again.'
          : 'Login failed. Please check your credentials.';
      }
    });
  }
}