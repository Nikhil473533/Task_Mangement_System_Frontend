import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Form, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,CommonModule, ButtonModule],
  standalone: true,
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  
private fb = inject(FormBuilder);
private authService = inject(AuthService);
private router = inject(Router);

    loginForm = this.fb.group({
       username: ['', Validators.required],
       password: ['', Validators.required]
  });

  onSubmit() {
    if(this.loginForm.invalid) return;

    const username = this.loginForm.value.username!;
    const password = this.loginForm.value.password!;

    this.authService.login(username, password).subscribe({
      next: () => 
        this.router.navigate(['/dashboard']),
      error: (err) => 
        console.error('Login Failed:', err)
    });
  }

}
