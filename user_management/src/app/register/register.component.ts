import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../api.service';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { map, catchError, debounceTime, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required], [this.existingUsernameValidator()]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]],
      email: ['', [Validators.required, Validators.email], [this.existingEmailValidator()]],
      phoneNumber: ['', [Validators.pattern(/^[0-9]{10,11}$/)], [this.existingPhoneNumberValidator()]],
      address: ['', Validators.required],
      gender: ['', Validators.required],
      department: ['', Validators.required],
      skills: [[]]
    });
  }

  ngOnInit() {}

  existingUsernameValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) return of(null);
      return of(control.value).pipe(
        debounceTime(300),
        switchMap(value => this.apiService.checkUsername(value)),
        map(exists => (exists ? { usernameExists: true } : null)),
        catchError(() => of(null))
      );
    };
  }

  existingEmailValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) return of(null);
      return of(control.value).pipe(
        debounceTime(300),
        switchMap(value => this.apiService.checkEmail(value)),
        map(exists => (exists ? { emailExists: true } : null)),
        catchError(() => of(null))
      );
    };
  }

  existingPhoneNumberValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) return of(null);
      return of(control.value).pipe(
        debounceTime(300),
        switchMap(value => this.apiService.checkPhoneNumber(value)),
        map(exists => (exists ? { phoneNumberExists: true } : null)),
        catchError(() => of(null))
      );
    };
  }

  updateSkills(skill: string, event: Event) {
    const target = event.target as HTMLInputElement;
    const skills = this.registerForm.get('skills')?.value || [];
    if (target.checked) {
      skills.push(skill);
    } else {
      skills.splice(skills.indexOf(skill), 1);
    }
    this.registerForm.get('skills')?.setValue(skills);
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const user = {
      username: this.registerForm.value.username,
      password: this.registerForm.value.password,
      email: this.registerForm.value.email,
      phoneNumber: this.registerForm.value.phoneNumber,
      address: this.registerForm.value.address,
      gender: this.registerForm.value.gender,
      department: this.registerForm.value.department,
      skills: this.registerForm.value.skills.join(',')
    };
    this.apiService.registerUser(user).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        alert('Registration successful!');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Register error:', error);
        alert('Registration failed!');
      }
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.registerForm.get(controlName);
    if (!control?.touched || !control?.errors) return '';

    if (control.errors['required']) {
      return `${controlName === 'username' ? 'Username' : controlName === 'password' ? 'Password' : controlName === 'email' ? 'Email' : controlName === 'address' ? 'Address' : controlName === 'gender' ? 'Gender' : 'Department'} is required`;
    }
    if (control.errors['minlength']) {
      return 'Password must be at least 8 characters';
    }
    if (control.errors['pattern'] && controlName === 'password') {
      return 'Password must contain uppercase, lowercase, number, and special character';
    }
    if (control.errors['email']) {
      return 'Invalid email format';
    }
    if (control.errors['pattern'] && controlName === 'phoneNumber') {
      return 'Phone number must be 10-11 digits';
    }
    if (control.errors['usernameExists']) {
      return 'Username already exists';
    }
    if (control.errors['emailExists']) {
      return 'Email already exists';
    }
    if (control.errors['phoneNumberExists']) {
      return 'Phone number already exists';
    }
    return '';
  }
}