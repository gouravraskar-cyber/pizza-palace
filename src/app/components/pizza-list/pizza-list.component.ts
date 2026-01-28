import { Component, inject, OnInit, AfterViewInit, ElementRef, ViewChildren, QueryList, effect, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PizzaCardComponent } from '../pizza-card/pizza-card.component';
import { PizzaService } from '../../services/pizza.service';
import { Pizza } from '../../data/pizza.data';

@Component({
  selector: 'app-pizza-list',
  standalone: true,
  imports: [CommonModule, PizzaCardComponent],
  templateUrl: './pizza-list.component.html',
  styleUrl: './pizza-list.component.scss'
})
export class PizzaListComponent implements OnInit, AfterViewInit {
  @ViewChildren('pizzaCard') pizzaCards!: QueryList<ElementRef>;

  private pizzaService = inject(PizzaService);

  // Local signal that mirrors the service signal
  pizzas = signal<Pizza[]>([]);
  isLoading = signal<boolean>(true);

  constructor() {
    // Use effect to react to service signal changes
    effect(() => {
      const items = this.pizzaService.items();
      const loading = this.pizzaService.isLoading();

      console.log('Pizza list effect triggered:', items.length, 'pizzas, loading:', loading);

      this.pizzas.set(items);
      this.isLoading.set(loading);

      // Setup scroll animation when pizzas are loaded
      if (items.length > 0 && !loading) {
        setTimeout(() => this.setupScrollAnimation(), 100);
      }
    }, { allowSignalWrites: true });
  }

  ngOnInit(): void {
    // Initial load check
    console.log('PizzaListComponent initialized');
  }

  ngAfterViewInit(): void {
    // Initial animation setup
    setTimeout(() => this.setupScrollAnimation(), 200);
  }

  private setupScrollAnimation(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    // Observe all pizza cards
    const cards = document.querySelectorAll('.pizza-list__item');
    cards.forEach((card) => observer.observe(card));
  }
}


