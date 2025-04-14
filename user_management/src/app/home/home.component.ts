import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  username: string | null = null;
  isAdmin: boolean = false;
  isLoading: boolean = true;

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    const cachedUser = localStorage.getItem('currentUser');
    const token = localStorage.getItem('token');

    if (cachedUser && token) {
      try {
        const user = JSON.parse(cachedUser);
        this.username = user.username;
        this.isAdmin = user.role === 'Admin';
        this.isLoading = false;
        return; 
      } catch (e) {
        console.error('Parse cache error:', e);
      }
    }

    if (token) {
      this.apiService.getCurrentUser().subscribe({
        next: (user) => {
          this.username = user.username;
          this.isAdmin = user.role === 'Admin';
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.isLoading = false;
        },
        error: () => {
          localStorage.removeItem('token');
          localStorage.removeItem('currentUser'); 
          this.isLoading = false;
        }
      });
    } else {
      this.isLoading = false; 
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser'); 
    this.username = null;
    this.isAdmin = false;
    this.isLoading = false;
  }
}