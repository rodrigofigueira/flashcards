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

  separatorKeysCodes: number[] = [ENTER, COMMA];
  labelCtrl = new FormControl('');
  filteredLabel: Observable<string[]>;
  labels: string[] = [];
  allLabels: string[] = [];

  @ViewChild('labelInput') labelInput?: ElementRef<HTMLInputElement>;


  constructor(private cardService: CardService){
    this.filteredLabel = this.labelCtrl.valueChanges.pipe(
      startWith(null),
      map((label: string | null) => (label ? this._filter(label) : this.allLabels.slice())),
    );
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our label
    if (value) {
      this.labels.push(value);
    }

    // Clear the input value
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

  //para filtrar por labels
  //arr.filter(x => x.labels.includes('ALB') || x.labels.includes('Classic Load Balance'))

  //para filtrar os labels
  //Array.from(new Set(arr.map(x => x.labels).flat(1)))

  ngOnInit(): void {

    this.cardService.getCards().subscribe(
      cards => {
        this.cards = this.shuffleArray(cards),
        this.selectedCard = this.cards[this.index];
        this.allLabels = (Array.from(new Set(this.cards.map(x => x.labels).flat(1))) as string[]);
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


}
