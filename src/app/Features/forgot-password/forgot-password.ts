import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../core/services/auth.service';
import { ButtonModule } from 'primeng/button';
import { catchError, EMPTY, switchMap, tap } from 'rxjs';
@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputGroupModule,
    InputGroupAddonModule,
    ToastModule,
    ButtonModule
  ],
  providers: [MessageService],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
})
export class ForgotPassword {

private fb = inject(FormBuilder);
private authService = inject(AuthService);
private router = inject(Router);
private messageService = inject(MessageService);

 forgotPasswordForm = this.fb.group({
       username: ['', Validators.required],
       newPassword: ['', Validators.required]
 });

onSubmit() {
if(this.forgotPasswordForm.invalid) return;

const username = this.forgotPasswordForm.value.username!;
const newPassword = this.forgotPasswordForm.value.newPassword!;

this.authService.forgotPassword(username).pipe(

tap(() => {
  this.showSuccess('Username found. Please enter the new password.');
}),

switchMap((data) => 
  this.authService.resetPassword(data.token, newPassword).pipe(
    catchError(() => {
      this.showError('Failed to reset password.');
      return EMPTY;
    })
  )
 )

).subscribe({
  next: () => {
   this.showSuccess('Password reset successful. Please login with your new password.');
   this.router.navigate(['/login']);
 },
 error: () => {
   this.showError('Username not found.');
 }
});
}

showSuccess(message: string) {
   this.messageService.add({
    severity: 'success',
    summary: 'Success',
    detail: message
   })
}

showError(message: string) {
   this.messageService.add({
    severity: 'error',
    summary: 'Error',
    detail: message
   })
}

}
