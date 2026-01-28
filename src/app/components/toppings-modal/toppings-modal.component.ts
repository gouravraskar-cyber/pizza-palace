import { Component, Input, Output, EventEmitter, signal, computed, OnChanges, SimpleChanges, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pizza } from '../../data/pizza.data';
import { Topping } from '../../data/toppings.data';
import { ToppingService } from '../../services/topping.service';
import { SizeService, PizzaSize } from '../../services/size.service';

export interface CartAddPayload {
  toppings: Topping[];
  size: PizzaSize;
}

@Component({
  selector: 'app-toppings-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toppings-modal.component.html',
  styleUrl: './toppings-modal.component.scss'
})
export class ToppingsModalComponent implements OnChanges, OnDestroy {
  @Input({ required: true }) pizza!: Pizza;
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() addToCart = new EventEmitter<CartAddPayload>();

  private toppingService = inject(ToppingService);
  private sizeService = inject(SizeService);

  selectedToppings = signal<Topping[]>([]);
  selectedSize = signal<PizzaSize | null>(null);
  activeCategory = signal<string>('cheese');

  // Get sizes from service
  sizes = computed(() => this.sizeService.items());

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']) {
      if (changes['isOpen'].currentValue) {
        document.body.classList.add('modal-open');
        // Set default size when modal opens
        if (!this.selectedSize()) {
          this.selectedSize.set(this.sizeService.getDefaultSize());
        }
      } else {
        document.body.classList.remove('modal-open');
      }
    }
  }

  ngOnDestroy(): void {
    document.body.classList.remove('modal-open');
  }

  categories = this.toppingService.categories;

  toppingsByCategory = computed(() => {
    const category = this.activeCategory();
    let toppings = this.toppingService.items().filter(t => t.category === category);

    // If pizza is veg, only show veg toppings
    if (this.pizza?.isVeg) {
      toppings = toppings.filter(t => t.isVeg);
    }

    return toppings;
  });

  totalToppingsPrice = computed(() =>
    this.selectedToppings().reduce((sum, t) => sum + t.price, 0)
  );

  // Price with size multiplier
  basePriceWithSize = computed(() => {
    const basePrice = this.pizza?.price || 0;
    const size = this.selectedSize();
    if (size) {
      return basePrice * size.price_multiplier;
    }
    return basePrice;
  });

  totalPrice = computed(() =>
    this.basePriceWithSize() + this.totalToppingsPrice()
  );

  setSize(size: PizzaSize): void {
    this.selectedSize.set(size);
  }

  isSizeSelected(size: PizzaSize): boolean {
    return this.selectedSize()?.id === size.id;
  }

  setCategory(category: string): void {
    this.activeCategory.set(category);
  }

  isSelected(topping: Topping): boolean {
    return this.selectedToppings().some(t => t.id === topping.id);
  }

  toggleTopping(topping: Topping): void {
    if (this.isSelected(topping)) {
      this.selectedToppings.update(toppings =>
        toppings.filter(t => t.id !== topping.id)
      );
    } else {
      this.selectedToppings.update(toppings => [...toppings, topping]);
    }
  }

  clearToppings(): void {
    this.selectedToppings.set([]);
  }

  onAddToCart(): void {
    const size = this.selectedSize() || this.sizeService.getDefaultSize();
    this.addToCart.emit({
      toppings: this.selectedToppings(),
      size: size
    });
    this.selectedToppings.set([]);
    this.selectedSize.set(this.sizeService.getDefaultSize());
    this.close.emit();
  }

  onClose(): void {
    this.selectedToppings.set([]);
    this.selectedSize.set(this.sizeService.getDefaultSize());
    this.close.emit();
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.onClose();
    }
  }
}

