import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../api.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: any[] = [];
  showConfirmDelete: boolean = false;
  userToDelete: any = null;

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.apiService.getUsers().subscribe({
      next: (data) => this.users = data.filter((user: any) => user.role !== 'Admin'),
      error: (error) => console.error('Error: ', error)
    });
  }

  confirmDelete(user: any) {
    this.userToDelete = user;
    this.showConfirmDelete = true;
  }

  deleteUser() {
    if (this.userToDelete) {
      this.apiService.deleteUser(this.userToDelete.id).subscribe({
        next: () => {
          this.users = this.users.filter(user => user.id !== this.userToDelete.id);
          this.showConfirmDelete = false;
          this.userToDelete = null;
        },
        error: (error) => console.error('Delete Error:', error)
      });
    }
  }

  cancelDelete() {
    this.showConfirmDelete = false;
    this.userToDelete = null;
  }
}