import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { PropertyCard, PropertyCreateDto, PropertyFull, SearchQuery } from '../../models/property.models';
import { AuthService } from './auth.service';
import { HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class PropertyService {
  private readonly api = `${environment.apiBase}/api/properties`;

  constructor(private http: HttpClient, private auth: AuthService) { }

  search(q: SearchQuery) {
    let params = new HttpParams();
    Object.entries(q).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        params = params.set(k, String(v));
      }
    });
    return this.http.get<{ total: number; page: number; pageSize: number; items: PropertyCard[] }>(
      `${this.api}/search`,
      { params }
    );
  }

  getById(id: number) {
    return this.http.get<PropertyFull>(`${this.api}/${id}`);
  }

  mine() {
    return this.http.get<PropertyFull[]>(`${this.api}/mine`);
  }

  createWithFiles(dto: PropertyCreateDto, files: File[]) {
    const form = new FormData();

    // append property fields
    Object.entries(dto).forEach(([k, v]) => {
      if (Array.isArray(v)) {
        v.forEach(val => form.append(k, val.toString())); // for AmenityIds
      } else if (v !== undefined && v !== null) {
        form.append(k, v.toString());
      }
    });

    // append files
    files.forEach(f => form.append('files', f));
    return this.http.post<{ id: number }>(this.api, form);
  }

  uploadImages(propertyId: number, formData: FormData) {
  return this.http.post<string[]>(`${this.api}/${propertyId}/images`, formData);
}

  // NEW: Update property
  update(id: number, data: any) {
    return this.http.put(`${environment.apiBase}/api/properties/${id}`, data);
  }

  // Delete property
  delete(id: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.auth.token}`
    });
    return this.http.delete(`${this.api}/${id}`, { headers });
  }

  // Delete a single property image
  deleteImage(propertyId: number, imageId: number) {
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.auth.token}` });
    return this.http.delete(`${this.api}/${propertyId}/images/${imageId}`, { headers });
  }

  // Optional: Get my properties
  getMine() {
    return this.http.get(`/api/properties/mine`);
  }

  getAmenities() {
    return this.http.get<{ id: number; name: string }[]>(`${this.api}/amenities`);
  }
}
