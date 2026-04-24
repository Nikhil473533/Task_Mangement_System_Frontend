import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../../core/services/auth.service';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ButtonModule,
    InputGroupAddonModule,
    InputGroupModule,
    ToastModule
  ],
  providers: [MessageService],
  standalone: true,
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  onSubmit() {
    if (this.loginForm.invalid) return;

    const username = this.loginForm.value.username!;
    const password = this.loginForm.value.password!;

    this.authService.login(username, password).subscribe({
      next: () => {
        this.showSuccess("Login Successful");
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.showError('Please enter valid username or password');
      }
    });
  }

  showError(message: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Login Failed',
      detail: message
    });
  }

  showSuccess(message: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Login Successful',
      detail: message
    });
  }

  forgotPassword() {
    this.router.navigate(['/forgot-password']);
  }
}


