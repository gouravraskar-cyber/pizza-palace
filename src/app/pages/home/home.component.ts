import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent } from '../../components/hero/hero.component';
import { PizzaListComponent } from '../../components/pizza-list/pizza-list.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeroComponent, PizzaListComponent],
  template: `
    <app-hero />
    <app-pizza-list />
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class HomeComponent {}


