import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { QuoteResponse } from '@shared/models';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  readonly url = 'https://api.kanye.rest';
  readonly #http = inject(HttpClient);

  getQuote(): Observable<string> {
    return this.#http
      .get<QuoteResponse>(this.url)
      .pipe(map((res) => res.quote));
  }
}
