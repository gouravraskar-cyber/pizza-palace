export interface Topping {
    id: number;
    name: string;
    price: number;
    category: 'cheese' | 'meat' | 'veggie' | 'sauce';
    isVeg: boolean;
    icon: string;
}

export const TOPPINGS: Topping[] = [
    // Cheese
    { id: 1, name: 'Extra Mozzarella', price: 1.50, category: 'cheese', isVeg: true, icon: '🧀' },
    { id: 2, name: 'Cheddar Cheese', price: 1.50, category: 'cheese', isVeg: true, icon: '🧀' },
    { id: 3, name: 'Parmesan', price: 2.00, category: 'cheese', isVeg: true, icon: '🧀' },
    { id: 4, name: 'Feta Cheese', price: 2.00, category: 'cheese', isVeg: true, icon: '🧀' },

    // Meat
    { id: 5, name: 'Pepperoni', price: 2.50, category: 'meat', isVeg: false, icon: '🥓' },
    { id: 6, name: 'Italian Sausage', price: 2.50, category: 'meat', isVeg: false, icon: '🌭' },
    { id: 7, name: 'Grilled Chicken', price: 3.00, category: 'meat', isVeg: false, icon: '🍗' },
    { id: 8, name: 'Crispy Bacon', price: 2.50, category: 'meat', isVeg: false, icon: '🥓' },
    { id: 9, name: 'Ham', price: 2.00, category: 'meat', isVeg: false, icon: '🍖' },

    // Veggies
    { id: 10, name: 'Mushrooms', price: 1.00, category: 'veggie', isVeg: true, icon: '🍄' },
    { id: 11, name: 'Bell Peppers', price: 1.00, category: 'veggie', isVeg: true, icon: '🫑' },
    { id: 12, name: 'Red Onions', price: 0.75, category: 'veggie', isVeg: true, icon: '🧅' },
    { id: 13, name: 'Black Olives', price: 1.25, category: 'veggie', isVeg: true, icon: '🫒' },
    { id: 14, name: 'Jalapeños', price: 1.00, category: 'veggie', isVeg: true, icon: '🌶️' },
    { id: 15, name: 'Fresh Tomatoes', price: 1.00, category: 'veggie', isVeg: true, icon: '🍅' },
    { id: 16, name: 'Spinach', price: 1.00, category: 'veggie', isVeg: true, icon: '🥬' },
    { id: 17, name: 'Pineapple', price: 1.25, category: 'veggie', isVeg: true, icon: '🍍' },

    // Sauces
    { id: 18, name: 'BBQ Drizzle', price: 0.75, category: 'sauce', isVeg: true, icon: '🍯' },
    { id: 19, name: 'Ranch Drizzle', price: 0.75, category: 'sauce', isVeg: true, icon: '🥛' },
    { id: 20, name: 'Hot Sauce', price: 0.50, category: 'sauce', isVeg: true, icon: '🌶️' },
    { id: 21, name: 'Garlic Butter', price: 0.75, category: 'sauce', isVeg: true, icon: '🧈' },
];

export const TOPPING_CATEGORIES = [
    { key: 'cheese', label: 'Extra Cheese', icon: '🧀' },
    { key: 'meat', label: 'Meats', icon: '🥓' },
    { key: 'veggie', label: 'Veggies', icon: '🥬' },
    { key: 'sauce', label: 'Sauces', icon: '🍯' },
];

