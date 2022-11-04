import { Component, OnInit } from '@angular/core';
import { Card } from './model/card.model';
import { CardService } from './services/card.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  index: number = 0;
  title = 'jornada-aws';
  isQuestion: boolean = true;
  selectedCard?: Card;
  cards: Card[] = [];

  constructor(private cardService: CardService){}

  ngOnInit(): void {

    this.cardService.getCards().subscribe(
      cards => this.cards = cards,
      error => console.log(error)
    )

    this.selectedCard = this.cards[this.index];

  }


  verResposta(){
    this.isQuestion = false;
  }

  proximaQuestao(){
    this.isQuestion = true;
    this.index++;
    this.selectedCard = this.cards[this.index];
  }

  reiniciarQuestoes(){
    this.index = 0;
    this.selectedCard = this.cards[this.index];
  }

}
