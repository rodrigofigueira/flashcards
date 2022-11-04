import { Component, OnInit } from '@angular/core';
import { Card } from 'src/app/model/card.model';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  card?: Card;

  constructor() { }

  ngOnInit(): void {}

}
