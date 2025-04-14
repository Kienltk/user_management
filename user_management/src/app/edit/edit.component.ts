import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../api.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  id: number | null = null;
  name: string = '';
  password: string = '';
  email: string = '';
  phoneNumber: string = '';
  address: string = '';
  gender: string = '';
  department: string = '';
  skills: string[] = [];
  isAdmin: boolean = false;
  currentUserId: number | null = null; 

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.apiService.getCurrentUser().subscribe({
      next: (user) => {
        this.isAdmin = user.role === 'Admin';
        this.currentUserId = user.id; 
      },
      error: (error) => {
        console.error('Error retrieving current user:', error);
        this.router.navigate(['/home']);
      }
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.id = +id;
        this.apiService.getUserById(this.id).subscribe({
          next: (user) => {
            this.name = user.username;
            this.email = user.email;
            this.phoneNumber = user.phoneNumber || '';
            this.address = user.address || '';
            this.gender = user.gender || '';
            this.department = user.department || '';
            this.skills = user.skills ? user.skills.split(',') : [];
          },
          error: (error) => {
            console.error('User retrieval error:', error);
            alert('Unable to load user information.');
            this.router.navigate(this.isAdmin ? ['/user-management'] : ['/profile']);
          }
        });
      } else {
        this.apiService.getCurrentUser().subscribe({
          next: (user) => {
            this.id = user.id;
            this.name = user.username;
            this.email = user.email;
            this.phoneNumber = user.phoneNumber || '';
            this.address = user.address || '';
            this.gender = user.gender || '';
            this.department = user.department || '';
            this.skills = user.skills ? user.skills.split(',') : [];
          },
          error: (error) => {
            console.error('Error retrieving current user:', error);
            this.router.navigate(['/home']);
          }
        });
      }
    });
  }

  updateSkills(event: Event, skill: string) {
    const target = event.target as HTMLInputElement;
    if (target.checked) {
      this.skills.push(skill);
    } else {
      this.skills = this.skills.filter(s => s !== skill);
    }
  }

  onSubmit() {
    if (this.id) {
      const user = {
        username: this.name,
        ...(this.id === this.currentUserId && this.password ? { password: this.password } : {}),
        email: this.email,
        phoneNumber: this.phoneNumber,
        address: this.address,
        gender: this.gender,
        department: this.department,
        skills: this.skills.join(',')
      };
      this.apiService.updateUser(this.id, user).subscribe({
        next: () => {
          localStorage.removeItem('currentUser');
          alert('Successfully updated!');
          if (this.id === this.currentUserId) {
            this.router.navigate(['/profile']);
          } else if (this.isAdmin) {
            this.router.navigate(['/user-management']);
          } else {
            this.router.navigate(['/profile']);
          }
        },
        error: (error) => {
          console.error('Update error:', error);
          alert('Update failed!');
        }
      });
    }
  }
}