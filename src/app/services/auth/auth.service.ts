import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { IAuthResponse } from '../../models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient
  ) { }

  private apiUrl = environment.apiUrl

  login(data: any): Observable<IAuthResponse> {
    return this.http.post<IAuthResponse>(`${this.apiUrl}/api/user/login`, data);
  }

  signup(data: any): Observable<IAuthResponse> {
    return this.http.post<IAuthResponse>(`${this.apiUrl}/api/user/signup`, data);
  }
}
