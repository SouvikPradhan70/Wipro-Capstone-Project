import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReservationCreateDto } from '../../models/reservation.models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private readonly api = `${environment.apiBase}/api/reservations`;

  constructor(private http: HttpClient) {}

  create(dto: ReservationCreateDto) {
    return this.http.post<{ id: number; status: string; totalPrice: number }>(this.api, dto);
  }
}
