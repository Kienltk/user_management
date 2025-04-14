import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../api.service';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any = null;
  showConfirmDelete: boolean = false;
  isOwnProfile: boolean = false; 

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.apiService.getUserById(+id).subscribe({
          next: (user) => {
            this.user = user;
            this.apiService.getCurrentUser().subscribe({
              next: (currentUser) => {
                this.isOwnProfile = currentUser.id === user.id;
              }
            });
          },
          error: (error) => {
            console.error('Error retrieving user:', error);
            this.user = null;
          }
        });
      } else {
        this.apiService.getCurrentUser().subscribe({
          next: (user) => {
            this.user = user;
            this.isOwnProfile = true;
          },
          error: (error) => {
            console.error('Error retrieving user:', error);
            this.user = null;
          }
        });
      }
    });
  }

  confirmDelete() {
    this.showConfirmDelete = true;
  }

  deleteAccount() {
    if (this.user) {
      this.apiService.deleteUser(this.user.id).subscribe({
        next: () => {
          localStorage.removeItem('token');
          this.showConfirmDelete = false;
          window.location.href = '/home';
        },
        error: (error) => console.error('Delete error:', error)
      });
    }
  }

  cancelDelete() {
    this.showConfirmDelete = false;
  }

  logout() {
    localStorage.removeItem('token');
    window.location.href = '/home';
  }
}