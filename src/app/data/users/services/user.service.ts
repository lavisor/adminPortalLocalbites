import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { User, UserApiResponse, mapApiResponseToUser } from '../models/user.model';
import { BACKEND_URL } from '../../data.const';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${BACKEND_URL}/api/users`;

  constructor(private http: HttpClient) {}

  getUsers(restaurantId?: string): Observable<User[]> {
    return this.http.get<{ status: number; data: UserApiResponse[] }>(`${this.apiUrl}/list`).pipe(
      map(response => response.data.map(mapApiResponseToUser)),
      catchError(error => {
        console.error('Error fetching users:', error);
        return throwError(() => new Error('Failed to fetch users'));
      })
    );
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<{ status: number; data: UserApiResponse }>(`${this.apiUrl}/details?id=${id}`).pipe(
      map(response => mapApiResponseToUser(response.data)),
      catchError(error => {
        console.error('Error fetching user:', error);
        return throwError(() => new Error('User not found'));
      })
    );
  }
}
