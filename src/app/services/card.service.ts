import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Card } from '../model/card.model';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  urlGet: string = 'assets/db.json';

  constructor(private httpClient: HttpClient) { }

  getCards(): Observable<Card[]>{
    return this.httpClient.get<Card[]>(this.urlGet);
  }

}
