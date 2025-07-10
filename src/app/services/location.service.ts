import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IPWHO_API_URL } from 'app/app.config';
import { map, Observable } from 'rxjs';

export interface UserLocation {
  latitude: number;
  longitude: number;
}

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  readonly #http = inject(HttpClient);
  readonly #url = inject(IPWHO_API_URL);

  getIpLocation(): Observable<string> {
    return this.#http
      .get<any>(this.#url)
      .pipe(map((response) => response.city || 'Munich'));
  }
}
