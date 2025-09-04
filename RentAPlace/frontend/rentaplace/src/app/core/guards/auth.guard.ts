import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate() {
    return this.auth.currentUser$.pipe(
      map(u => {
        if (!u) {
          this.router.navigate(['/login']);
          return false;
        }
        return true;
      })
    );
  }
}
