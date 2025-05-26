import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OTPService {
  generateOtp(length: number = 6): Observable<string> {
    const otp = Array.from({ length }, () =>
      Math.floor(Math.random() * 10)
    ).join('');
    return of(otp);
  }
}
