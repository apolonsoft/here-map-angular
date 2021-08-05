import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {HereMapAutocompleteResponse} from "../../models/here-map-autocomplete-response";

@Injectable({
  providedIn: 'root'
})
export class HereMapService {

  constructor(
    private http: HttpClient
  ) { }

  autoComplete(query: string): Observable<HereMapAutocompleteResponse> {
    return this.http.get<HereMapAutocompleteResponse>('https://autocomplete.search.hereapi.com/v1/autocomplete', {
      params: {
        apiKey: environment.apiKeyRest,
        types: 'postalCode',
        in: 'countryCode:USA',
        q: query
      }
    });
  }

  getCode(query: string): Observable<any> {
    return this.http.get('https://geocode.search.hereapi.com/v1/geocode', {
      params: {
        apiKey: environment.apiKeyRest,
        types: 'postalCode',
        in: 'countryCode:USA',
        q: query
      }
    })
  }
}
