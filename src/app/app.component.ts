import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { Card } from './model/card.model';
import { CardService } from './services/card.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  index: number = 0;
  title = 'Flash Cards';
  isQuestion: boolean = true;
  selectedCard?: Card;
  cards: Card[] = [];
  allCards: Card[] = [];

  separatorKeysCodes: number[] = [ENTER, COMMA];
  labelCtrl = new FormControl('');
  filteredLabel?: Observable<string[]>;
  labels: string[] = [];
  allLabels: string[] = [];

  @ViewChild('labelInput') labelInput?: ElementRef<HTMLInputElement>;


  constructor(private cardService: CardService){}

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.labels.push(value);
    }

    event.chipInput!.clear();

    this.labelCtrl.setValue(null);
  }

  remove(label: string): void {
    const index = this.labels.indexOf(label);

    if (index >= 0) {
      this.labels.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.labels.push(event.option.viewValue);
    this.labelInput!.nativeElement.value = '';
    this.labelCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allLabels.filter(label => label.toLowerCase().includes(filterValue));
  }

  ngOnInit(): void {

    this.cardService.getCards().subscribe(
      cards => {
        this.allCards = cards;
        this.allLabels = (Array.from(new Set(this.allCards.map(x => x.labels).flat(1))) as string[]);

        this.filteredLabel = this.labelCtrl.valueChanges.pipe(
          startWith(null),
          map((label: string | null) => (label ? this._filter(label) : this.allLabels.slice())),
        );

      },
      error => console.log(error)
    )

  }

  verResposta(){
    this.isQuestion = false;
  }

  proximaQuestao(){
    this.isQuestion = true;
    this.index++;
    this.selectedCard = this.cards[this.index];
  }

  voltarQuestao(){
    this.isQuestion = true;
    this.index--;
    this.selectedCard = this.cards[this.index];
  }

  reiniciarQuestoes(){
    this.index = 0;
    this.selectedCard = this.cards[this.index];
  }

  shuffleArray(arr: Card[]): Card[] {

    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;

  }

  filtrarPorLabels(){

    let arr = this.allCards.filter(card => {
      return card.labels?.some(e => { return this.labels.some(f => { return f == e}) });
    });

    this.cards = this.shuffleArray(arr);
    this.selectedCard = this.cards[this.index];

  }

  filtrarCardsPorLabelsSelecionados(){
    this.cards = this.shuffleArray(this.allCards);
    this.selectedCard = this.cards[this.index];
  }


}
