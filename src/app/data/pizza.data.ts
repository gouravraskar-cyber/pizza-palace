export interface Pizza {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isVeg: boolean;
  ingredients: string[];
}

export const PIZZAS: Pizza[] = [
  {
    id: 1,
    name: 'Margherita',
    description: 'The timeless classic featuring fresh tomato sauce, creamy mozzarella, and aromatic basil on our signature hand-tossed crust.',
    price: 12.99,
    imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80',
    isVeg: true,
    ingredients: ['Fresh Mozzarella', 'San Marzano Tomatoes', 'Fresh Basil', 'Extra Virgin Olive Oil', 'Sea Salt']
  },
  {
    id: 2,
    name: 'Pepperoni',
    description: 'Loaded with premium pepperoni slices that crisp up perfectly, layered over melted mozzarella and our tangy tomato sauce.',
    price: 14.99,
    imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&q=80',
    isVeg: false,
    ingredients: ['Spicy Pepperoni', 'Mozzarella Cheese', 'Tomato Sauce', 'Italian Herbs', 'Parmesan Dust']
  },
  {
    id: 3,
    name: 'Farmhouse',
    description: 'A garden delight packed with colorful bell peppers, mushrooms, onions, and olives for the veggie lovers.',
    price: 13.99,
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80',
    isVeg: true,
    ingredients: ['Bell Peppers', 'Button Mushrooms', 'Red Onions', 'Black Olives', 'Sweet Corn', 'Mozzarella']
  },
  {
    id: 4,
    name: 'BBQ Chicken',
    description: 'Smoky BBQ sauce topped with tender grilled chicken, caramelized onions, and a blend of melted cheeses.',
    price: 16.99,
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80',
    isVeg: false,
    ingredients: ['Grilled Chicken', 'Smoky BBQ Sauce', 'Caramelized Onions', 'Smoked Gouda', 'Fresh Cilantro', 'Mozzarella']
  },
  {
    id: 5,
    name: 'Cheese Burst',
    description: 'For the ultimate cheese lovers - a molten cheese-filled crust with triple cheese topping that stretches with every bite.',
    price: 15.99,
    imageUrl: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=800&q=80',
    isVeg: true,
    ingredients: ['Cheese-Stuffed Crust', 'Triple Mozzarella', 'Cheddar Cheese', 'Parmesan', 'Cream Cheese Swirl', 'Garlic Butter']
  },
  {
    id: 6,
    name: 'Paneer Tikka',
    description: 'An Indian fusion masterpiece featuring tandoori-marinated paneer cubes with spicy tikka sauce and fresh vegetables.',
    price: 15.49,
    imageUrl: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=800&q=80',
    isVeg: true,
    ingredients: ['Tandoori Paneer', 'Tikka Masala Sauce', 'Bell Peppers', 'Red Onions', 'Green Chilies', 'Fresh Coriander', 'Mint Drizzle']
  },
  {
    id: 7,
    name: 'Hawaiian Paradise',
    description: 'A tropical twist with sweet pineapple chunks and savory ham on a bed of melted cheese and tangy tomato sauce.',
    price: 14.49,
    imageUrl: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800&q=80',
    isVeg: false,
    ingredients: ['Premium Ham', 'Fresh Pineapple', 'Mozzarella', 'Tomato Sauce', 'Cherry Tomatoes', 'Italian Oregano']
  },
  {
    id: 8,
    name: 'Meat Feast',
    description: 'A carnivore\'s dream loaded with pepperoni, Italian sausage, bacon, and ground beef on our signature crust.',
    price: 18.99,
    imageUrl: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&q=80',
    isVeg: false,
    ingredients: ['Pepperoni', 'Italian Sausage', 'Crispy Bacon', 'Ground Beef', 'Mozzarella', 'Red Pepper Flakes']
  },
  {
    id: 9,
    name: 'Mediterranean',
    description: 'Sun-dried tomatoes, feta cheese, Kalamata olives, and fresh spinach transport you to the shores of Greece.',
    price: 16.49,
    imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80',
    isVeg: true,
    ingredients: ['Sun-Dried Tomatoes', 'Feta Cheese', 'Kalamata Olives', 'Fresh Spinach', 'Red Onions', 'Oregano', 'Olive Oil']
  },
  {
    id: 10,
    name: 'Buffalo Chicken',
    description: 'Spicy buffalo sauce with crispy chicken chunks, blue cheese crumbles, and a cooling ranch drizzle.',
    price: 17.49,
    imageUrl: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=800&q=80',
    isVeg: false,
    ingredients: ['Crispy Chicken', 'Buffalo Hot Sauce', 'Blue Cheese', 'Ranch Drizzle', 'Celery', 'Mozzarella', 'Green Onions']
  },
  {
    id: 11,
    name: 'Truffle Mushroom',
    description: 'An elegant blend of wild mushrooms, truffle oil, and creamy garlic sauce topped with fresh arugula.',
    price: 19.99,
    imageUrl: 'https://images.unsplash.com/photo-1601924582970-9238bcb495d9?w=800&q=80',
    isVeg: true,
    ingredients: ['Wild Mushrooms', 'Truffle Oil', 'Garlic Cream Sauce', 'Fresh Arugula', 'Parmesan Shavings', 'Thyme']
  },
  {
    id: 12,
    name: 'Spicy Jalapeño',
    description: 'For heat seekers - loaded with jalapeños, spicy chorizo, pepper jack cheese, and a sriracha drizzle.',
    price: 15.99,
    imageUrl: 'https://images.unsplash.com/photo-1595708684082-a173bb3a06c5?w=800&q=80',
    isVeg: false,
    ingredients: ['Fresh Jalapeños', 'Spicy Chorizo', 'Pepper Jack Cheese', 'Sriracha Drizzle', 'Red Onions', 'Cilantro']
  },
  {
    id: 13,
    name: 'Veggie Supreme',
    description: 'A colorful medley of fresh vegetables including zucchini, eggplant, tomatoes, and artichoke hearts.',
    price: 14.99,
    imageUrl: 'https://images.unsplash.com/photo-1511689660979-10d2b1aada49?w=800&q=80',
    isVeg: true,
    ingredients: ['Zucchini', 'Eggplant', 'Cherry Tomatoes', 'Artichoke Hearts', 'Bell Peppers', 'Red Onions', 'Fresh Basil']
  },
  {
    id: 14,
    name: 'Philly Cheesesteak',
    description: 'Thinly sliced ribeye steak with sautéed peppers, onions, and provolone cheese on our garlic butter crust.',
    price: 18.49,
    imageUrl: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=800&q=80',
    isVeg: false,
    ingredients: ['Sliced Ribeye', 'Green Peppers', 'Caramelized Onions', 'Provolone Cheese', 'Garlic Butter', 'Mushrooms']
  },
  {
    id: 15,
    name: 'Quattro Formaggi',
    description: 'Four cheese perfection with mozzarella, gorgonzola, fontina, and parmesan in perfect harmony.',
    price: 17.99,
    imageUrl: 'https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?w=800&q=80',
    isVeg: true,
    ingredients: ['Mozzarella', 'Gorgonzola', 'Fontina', 'Parmesan', 'Garlic Oil', 'Fresh Rosemary', 'Honey Drizzle']
  },
  {
    id: 16,
    name: 'Seafood Deluxe',
    description: 'A taste of the ocean with shrimp, calamari, and crab meat on a white garlic sauce base.',
    price: 21.99,
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80',
    isVeg: false,
    ingredients: ['Tiger Shrimp', 'Calamari Rings', 'Crab Meat', 'Garlic White Sauce', 'Lemon Zest', 'Fresh Dill', 'Parsley']
  },
  {
    id: 17,
    name: 'Pesto Chicken',
    description: 'Aromatic basil pesto with grilled chicken, sun-dried tomatoes, and pine nuts for a gourmet experience.',
    price: 16.99,
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80',
    isVeg: false,
    ingredients: ['Grilled Chicken', 'Fresh Basil Pesto', 'Sun-Dried Tomatoes', 'Pine Nuts', 'Mozzarella', 'Parmesan']
  },
  {
    id: 18,
    name: 'Spinach Artichoke',
    description: 'Creamy spinach artichoke dip as a base with roasted garlic, feta, and fresh herbs.',
    price: 15.49,
    imageUrl: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=800&q=80',
    isVeg: true,
    ingredients: ['Fresh Spinach', 'Artichoke Hearts', 'Roasted Garlic', 'Feta Cheese', 'Cream Sauce', 'Mozzarella', 'Italian Herbs']
  },
  {
    id: 19,
    name: 'Mexican Fiesta',
    description: 'Seasoned ground beef, black beans, jalapeños, and fresh salsa with a sour cream drizzle.',
    price: 16.49,
    imageUrl: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=800&q=80',
    isVeg: false,
    ingredients: ['Seasoned Beef', 'Black Beans', 'Jalapeños', 'Fresh Salsa', 'Sour Cream', 'Cheddar', 'Cilantro', 'Lime']
  },
  {
    id: 20,
    name: 'Tandoori Chicken',
    description: 'Tender tandoori-spiced chicken with mint yogurt sauce, onions, and a sprinkle of chaat masala.',
    price: 16.99,
    imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&q=80',
    isVeg: false,
    ingredients: ['Tandoori Chicken', 'Mint Yogurt Sauce', 'Red Onions', 'Green Chilies', 'Chaat Masala', 'Fresh Coriander', 'Ginger']
  },
  {
    id: 21,
    name: 'Capricciosa',
    description: 'Italian classic with ham, mushrooms, artichokes, and black olives on traditional tomato sauce.',
    price: 15.99,
    imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80',
    isVeg: false,
    ingredients: ['Italian Ham', 'Button Mushrooms', 'Artichoke Hearts', 'Black Olives', 'Tomato Sauce', 'Mozzarella', 'Oregano']
  },
  {
    id: 22,
    name: 'Vegan Delight',
    description: 'Plant-based cheese with roasted vegetables, vegan sausage crumbles, and fresh herbs.',
    price: 17.49,
    imageUrl: 'https://images.unsplash.com/photo-1511689660979-10d2b1aada49?w=800&q=80',
    isVeg: true,
    ingredients: ['Vegan Cheese', 'Vegan Sausage', 'Roasted Peppers', 'Mushrooms', 'Red Onions', 'Fresh Basil', 'Olive Oil']
  },
  {
    id: 23,
    name: 'Bacon Ranch',
    description: 'Crispy bacon strips with creamy ranch sauce, chicken, and a blend of melted cheeses.',
    price: 17.99,
    imageUrl: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&q=80',
    isVeg: false,
    ingredients: ['Crispy Bacon', 'Ranch Sauce', 'Grilled Chicken', 'Cheddar', 'Mozzarella', 'Green Onions', 'Tomatoes']
  },
  {
    id: 24,
    name: 'Garlic Prawn',
    description: 'Succulent prawns in garlic butter sauce with cherry tomatoes, parsley, and a hint of lemon.',
    price: 20.99,
    imageUrl: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800&q=80',
    isVeg: false,
    ingredients: ['King Prawns', 'Garlic Butter', 'Cherry Tomatoes', 'Fresh Parsley', 'Lemon Zest', 'Mozzarella', 'Chili Flakes']
  }
];
