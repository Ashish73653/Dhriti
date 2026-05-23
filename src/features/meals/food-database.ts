import { FoodItem } from '@/types';

export const FOOD_DATABASE: FoodItem[] = [
  // ── INDIAN BREAKFAST ──
  { id: 'idli', name: 'Idli (2 pieces)', category: 'Breakfast', cuisine: 'indian', calories: 130, proteinG: 4.5, carbsG: 27, fatG: 0.5, sugarG: 1, fiberG: 1.5, servingSize: '2 pieces', foodClass: 'GREEN' },
  { id: 'dosa', name: 'Plain Dosa', category: 'Breakfast', cuisine: 'indian', calories: 168, proteinG: 4, carbsG: 32, fatG: 3, sugarG: 1, fiberG: 1, servingSize: '1 piece', foodClass: 'GREEN' },
  { id: 'masala-dosa', name: 'Masala Dosa', category: 'Breakfast', cuisine: 'indian', calories: 304, proteinG: 7, carbsG: 48, fatG: 9, sugarG: 2, fiberG: 3, servingSize: '1 piece', foodClass: 'YELLOW' },
  { id: 'upma', name: 'Upma (1 bowl)', category: 'Breakfast', cuisine: 'indian', calories: 200, proteinG: 5, carbsG: 34, fatG: 6, sugarG: 2, fiberG: 2, servingSize: '1 bowl', foodClass: 'GREEN' },
  { id: 'upma-veg', name: 'Vegetable Upma (1 bowl)', category: 'Breakfast', cuisine: 'indian', calories: 210, proteinG: 6, carbsG: 36, fatG: 5, sugarG: 3, fiberG: 3, servingSize: '1 bowl', foodClass: 'GREEN' },
  { id: 'poha', name: 'Poha (1 bowl)', category: 'Breakfast', cuisine: 'indian', calories: 270, proteinG: 5, carbsG: 50, fatG: 6, sugarG: 3, fiberG: 2, servingSize: '1 bowl', foodClass: 'YELLOW' },
  { id: 'aloo-paratha', name: 'Aloo Paratha', category: 'Breakfast', cuisine: 'indian', calories: 260, proteinG: 6, carbsG: 38, fatG: 9, sugarG: 2, fiberG: 3, servingSize: '1 piece', foodClass: 'YELLOW' },
  { id: 'plain-paratha', name: 'Plain Paratha', category: 'Breakfast', cuisine: 'indian', calories: 200, proteinG: 4, carbsG: 28, fatG: 8, sugarG: 1, fiberG: 2, servingSize: '1 piece', foodClass: 'YELLOW' },
  { id: 'puri', name: 'Puri (2 pieces)', category: 'Breakfast', cuisine: 'indian', calories: 280, proteinG: 5, carbsG: 35, fatG: 13, sugarG: 1, fiberG: 1, servingSize: '2 pieces', foodClass: 'YELLOW' },
  { id: 'besan-chilla', name: 'Besan Chilla (2 pieces)', category: 'Breakfast', cuisine: 'indian', calories: 220, proteinG: 12, carbsG: 28, fatG: 7, sugarG: 2, fiberG: 4, servingSize: '2 pieces', foodClass: 'GREEN' },
  { id: 'oats-chilla', name: 'Oats Vegetable Chilla', category: 'Breakfast', cuisine: 'indian', calories: 220, proteinG: 8, carbsG: 35, fatG: 5, sugarG: 2, fiberG: 6, servingSize: '1 chilla', foodClass: 'GREEN' },
  { id: 'oats-porridge', name: 'Oats Porridge (1 bowl)', category: 'Breakfast', cuisine: 'universal', calories: 180, proteinG: 7, carbsG: 30, fatG: 4, sugarG: 3, fiberG: 4, servingSize: '1 bowl', foodClass: 'GREEN' },
  { id: 'masala-oats', name: 'Masala Oats (1 bowl)', category: 'Breakfast', cuisine: 'indian', calories: 170, proteinG: 6, carbsG: 28, fatG: 3.5, sugarG: 2, fiberG: 5, servingSize: '1 bowl', foodClass: 'GREEN' },

  // ── INDIAN DAL ──
  { id: 'dal-tadka', name: 'Dal Tadka (1 bowl)', category: 'Dal', cuisine: 'indian', calories: 188, proteinG: 10, carbsG: 28, fatG: 5, sugarG: 3, fiberG: 7, servingSize: '1 bowl', foodClass: 'GREEN' },
  { id: 'dal-makhani', name: 'Dal Makhani (1 bowl)', category: 'Dal', cuisine: 'indian', calories: 250, proteinG: 11, carbsG: 30, fatG: 10, sugarG: 4, fiberG: 8, servingSize: '1 bowl', foodClass: 'YELLOW' },
  { id: 'rajma', name: 'Rajma (1 bowl)', category: 'Dal', cuisine: 'indian', calories: 210, proteinG: 13, carbsG: 32, fatG: 4, sugarG: 3, fiberG: 9, servingSize: '1 bowl', foodClass: 'GREEN' },
  { id: 'chole', name: 'Chole (1 bowl)', category: 'Dal', cuisine: 'indian', calories: 220, proteinG: 11, carbsG: 33, fatG: 6, sugarG: 4, fiberG: 8, servingSize: '1 bowl', foodClass: 'GREEN' },
  { id: 'moong-dal', name: 'Moong Dal (1 bowl)', category: 'Dal', cuisine: 'indian', calories: 150, proteinG: 10, carbsG: 22, fatG: 3, sugarG: 2, fiberG: 6, servingSize: '1 bowl', foodClass: 'GREEN' },
  { id: 'dal-fry', name: 'Dal Fry (1 bowl)', category: 'Dal', cuisine: 'indian', calories: 175, proteinG: 9, carbsG: 25, fatG: 4.5, sugarG: 2, fiberG: 6.5, servingSize: '1 bowl', foodClass: 'GREEN' },

  // ── INDIAN CURRIES & PROTEINS ──
  { id: 'butter-chicken', name: 'Butter Chicken (1 serving)', category: 'Curry', cuisine: 'indian', calories: 290, proteinG: 25, carbsG: 12, fatG: 16, sugarG: 6, fiberG: 1, servingSize: '1 serving', foodClass: 'YELLOW' },
  { id: 'chicken-curry', name: 'Chicken Curry (1 serving)', category: 'Curry', cuisine: 'indian', calories: 240, proteinG: 24, carbsG: 8, fatG: 13, sugarG: 3, fiberG: 2, servingSize: '1 serving', foodClass: 'GREEN' },
  { id: 'paneer-bhurji', name: 'Paneer Bhurji', category: 'Curry', cuisine: 'indian', calories: 320, proteinG: 18, carbsG: 6, fatG: 24, sugarG: 2, fiberG: 2, servingSize: '1 serving', foodClass: 'YELLOW' },
  { id: 'egg-bhurji', name: 'Egg Bhurji (3 eggs)', category: 'Curry', cuisine: 'indian', calories: 240, proteinG: 18, carbsG: 3, fatG: 18, sugarG: 1, fiberG: 1, servingSize: '3 eggs', foodClass: 'GREEN' },
  { id: 'soya-curry', name: 'Soya Chunks Curry', category: 'Curry', cuisine: 'indian', calories: 180, proteinG: 25, carbsG: 15, fatG: 3, sugarG: 1, fiberG: 6, servingSize: '1 bowl', foodClass: 'GREEN' },
  { id: 'palak-paneer', name: 'Palak Paneer (1 serving)', category: 'Curry', cuisine: 'indian', calories: 280, proteinG: 14, carbsG: 12, fatG: 20, sugarG: 4, fiberG: 4, servingSize: '1 serving', foodClass: 'YELLOW' },
  { id: 'paneer-butter-masala', name: 'Paneer Butter Masala', category: 'Curry', cuisine: 'indian', calories: 320, proteinG: 14, carbsG: 18, fatG: 22, sugarG: 8, fiberG: 2, servingSize: '1 serving', foodClass: 'YELLOW' },
  { id: 'paneer-tikka', name: 'Paneer Tikka (6 pieces)', category: 'Curry', cuisine: 'indian', calories: 280, proteinG: 16, carbsG: 8, fatG: 20, sugarG: 3, fiberG: 2, servingSize: '6 pieces', foodClass: 'YELLOW' },
  { id: 'chicken-tikka', name: 'Chicken Tikka (6 pieces)', category: 'Curry', cuisine: 'indian', calories: 240, proteinG: 30, carbsG: 4, fatG: 10, sugarG: 1, fiberG: 1, servingSize: '6 pieces', foodClass: 'GREEN' },
  { id: 'fish-curry', name: 'Fish Curry (1 serving)', category: 'Curry', cuisine: 'indian', calories: 200, proteinG: 22, carbsG: 8, fatG: 9, sugarG: 3, fiberG: 2, servingSize: '1 serving', foodClass: 'GREEN' },
  { id: 'egg-curry', name: 'Egg Curry (2 eggs)', category: 'Curry', cuisine: 'indian', calories: 220, proteinG: 14, carbsG: 10, fatG: 14, sugarG: 4, fiberG: 2, servingSize: '2 eggs', foodClass: 'GREEN' },
  { id: 'aloo-gobi', name: 'Aloo Gobi (1 serving)', category: 'Sabzi', cuisine: 'indian', calories: 150, proteinG: 4, carbsG: 24, fatG: 5, sugarG: 4, fiberG: 4, servingSize: '1 serving', foodClass: 'GREEN' },
  { id: 'bhindi-fry', name: 'Bhindi Fry (1 serving)', category: 'Sabzi', cuisine: 'indian', calories: 110, proteinG: 3, carbsG: 14, fatG: 5, sugarG: 3, fiberG: 5, servingSize: '1 serving', foodClass: 'GREEN' },
  { id: 'baingan-bharta', name: 'Baingan Bharta (1 serving)', category: 'Sabzi', cuisine: 'indian', calories: 130, proteinG: 3, carbsG: 16, fatG: 6, sugarG: 5, fiberG: 5, servingSize: '1 serving', foodClass: 'GREEN' },
  { id: 'mixed-veg', name: 'Mixed Vegetable Curry', category: 'Sabzi', cuisine: 'indian', calories: 120, proteinG: 4, carbsG: 18, fatG: 4, sugarG: 5, fiberG: 5, servingSize: '1 serving', foodClass: 'GREEN' },

  // ── RICE & BREAD ──
  { id: 'white-rice', name: 'White Rice (1 cup cooked)', category: 'Grains', cuisine: 'universal', calories: 206, proteinG: 4, carbsG: 45, fatG: 0.5, sugarG: 0, fiberG: 0.6, servingSize: '1 cup', foodClass: 'YELLOW' },
  { id: 'brown-rice', name: 'Brown Rice (1 cup cooked)', category: 'Grains', cuisine: 'universal', calories: 215, proteinG: 5, carbsG: 45, fatG: 1.8, sugarG: 0, fiberG: 3.5, servingSize: '1 cup', foodClass: 'GREEN' },
  { id: 'jeera-rice', name: 'Jeera Rice (1 cup cooked)', category: 'Grains', cuisine: 'indian', calories: 230, proteinG: 4.2, carbsG: 48, fatG: 2.5, sugarG: 0.2, fiberG: 1, servingSize: '1 cup', foodClass: 'YELLOW' },
  { id: 'chicken-biryani', name: 'Chicken Biryani (1 plate)', category: 'Rice', cuisine: 'indian', calories: 500, proteinG: 28, carbsG: 60, fatG: 16, sugarG: 4, fiberG: 3, servingSize: '1 plate', foodClass: 'RED' },
  { id: 'veg-biryani', name: 'Veg Biryani (1 plate)', category: 'Rice', cuisine: 'indian', calories: 380, proteinG: 10, carbsG: 65, fatG: 10, sugarG: 5, fiberG: 4, servingSize: '1 plate', foodClass: 'YELLOW' },
  { id: 'khichdi', name: 'Moong Dal Khichdi (1 bowl)', category: 'Rice', cuisine: 'indian', calories: 220, proteinG: 9, carbsG: 38, fatG: 5, sugarG: 2, fiberG: 4, servingSize: '1 bowl', foodClass: 'GREEN' },
  { id: 'roti', name: 'Roti / Chapati (1 piece)', category: 'Bread', cuisine: 'indian', calories: 104, proteinG: 3, carbsG: 20, fatG: 2, sugarG: 0.5, fiberG: 2, servingSize: '1 piece', foodClass: 'GREEN' },
  { id: 'roti-ghee', name: 'Roti with Ghee (1 piece)', category: 'Bread', cuisine: 'indian', calories: 135, proteinG: 3.1, carbsG: 20, fatG: 5.5, sugarG: 0.5, fiberG: 2, servingSize: '1 piece', foodClass: 'YELLOW' },
  { id: 'naan', name: 'Plain Naan (1 piece)', category: 'Bread', cuisine: 'indian', calories: 280, proteinG: 8, carbsG: 48, fatG: 7, sugarG: 3, fiberG: 2, servingSize: '1 piece', foodClass: 'YELLOW' },

  // ── SNACKS ──
  { id: 'samosa', name: 'Samosa (1 piece)', category: 'Snack', cuisine: 'indian', calories: 150, proteinG: 3, carbsG: 18, fatG: 7, sugarG: 2, fiberG: 2, servingSize: '1 piece', foodClass: 'YELLOW' },
  { id: 'pakora', name: 'Pakora (4 pieces)', category: 'Snack', cuisine: 'indian', calories: 200, proteinG: 5, carbsG: 22, fatG: 10, sugarG: 2, fiberG: 3, servingSize: '4 pieces', foodClass: 'YELLOW' },
  { id: 'pav-bhaji', name: 'Pav Bhaji (1 plate)', category: 'Snack', cuisine: 'indian', calories: 380, proteinG: 9, carbsG: 58, fatG: 13, sugarG: 8, fiberG: 5, servingSize: '1 plate', foodClass: 'YELLOW' },
  { id: 'vada-pav', name: 'Vada Pav (1 piece)', category: 'Snack', cuisine: 'indian', calories: 290, proteinG: 7, carbsG: 42, fatG: 10, sugarG: 4, fiberG: 3, servingSize: '1 piece', foodClass: 'YELLOW' },
  { id: 'bhel-puri', name: 'Bhel Puri (1 bowl)', category: 'Snack', cuisine: 'indian', calories: 130, proteinG: 4, carbsG: 22, fatG: 4, sugarG: 5, fiberG: 2, servingSize: '1 bowl', foodClass: 'GREEN' },
  { id: 'dhokla', name: 'Dhokla (4 pieces)', category: 'Snack', cuisine: 'indian', calories: 160, proteinG: 7, carbsG: 26, fatG: 4, sugarG: 4, fiberG: 2, servingSize: '4 pieces', foodClass: 'GREEN' },
  { id: 'papad', name: 'Roasted Papad (1 piece)', category: 'Snack', cuisine: 'indian', calories: 35, proteinG: 1.5, carbsG: 6, fatG: 0.1, sugarG: 0.1, fiberG: 0.5, servingSize: '1 piece', foodClass: 'GREEN' },
  { id: 'roasted-chana', name: 'Roasted Chana (1 bowl)', category: 'Snack', cuisine: 'indian', calories: 160, proteinG: 9, carbsG: 26, fatG: 2.5, sugarG: 1, fiberG: 6, servingSize: '1 bowl', foodClass: 'GREEN' },

  // ── DAIRY / RAITA ──
  { id: 'curd', name: 'Curd / Dahi (1 bowl)', category: 'Dairy', cuisine: 'indian', calories: 98, proteinG: 7, carbsG: 7, fatG: 4, sugarG: 6, fiberG: 0, servingSize: '1 bowl', foodClass: 'GREEN' },
  { id: 'curd-low-fat', name: 'Low Fat Curd (1 bowl)', category: 'Dairy', cuisine: 'indian', calories: 60, proteinG: 8, carbsG: 6, fatG: 1.5, sugarG: 5, fiberG: 0, servingSize: '1 bowl', foodClass: 'GREEN' },
  { id: 'paneer', name: 'Paneer (100g)', category: 'Dairy', cuisine: 'indian', calories: 265, proteinG: 18, carbsG: 4, fatG: 20, sugarG: 1, fiberG: 0, servingSize: '100g', foodClass: 'YELLOW' },
  { id: 'tofu', name: 'Soy Tofu (100g)', category: 'Dairy', cuisine: 'universal', calories: 80, proteinG: 8, carbsG: 2, fatG: 4.5, sugarG: 0.5, fiberG: 1, servingSize: '100g', foodClass: 'GREEN' },
  { id: 'raita-boondi', name: 'Boondi Raita (1 bowl)', category: 'Dairy', cuisine: 'indian', calories: 120, proteinG: 4, carbsG: 12, fatG: 6, sugarG: 4, fiberG: 1, servingSize: '1 bowl', foodClass: 'YELLOW' },
  { id: 'raita-veg', name: 'Mixed Veg Raita (1 bowl)', category: 'Dairy', cuisine: 'indian', calories: 60, proteinG: 3.5, carbsG: 6, fatG: 2, sugarG: 4, fiberG: 1, servingSize: '1 bowl', foodClass: 'GREEN' },
  { id: 'buttermilk', name: 'Buttermilk / Chaas (1 glass)', category: 'Dairy', cuisine: 'indian', calories: 40, proteinG: 3, carbsG: 5, fatG: 1, sugarG: 4, fiberG: 0, servingSize: '1 glass', foodClass: 'GREEN' },
  { id: 'lassi-sweet', name: 'Sweet Lassi (1 glass)', category: 'Dairy', cuisine: 'indian', calories: 250, proteinG: 8, carbsG: 38, fatG: 8, sugarG: 28, fiberG: 0, servingSize: '1 glass', foodClass: 'RED' },

  // ── PROTEINS & SUPPLEMENTS ──
  { id: 'egg-boiled', name: 'Boiled Egg (1 whole)', category: 'Protein', cuisine: 'universal', calories: 68, proteinG: 6, carbsG: 0.5, fatG: 5, sugarG: 0, fiberG: 0, servingSize: '1 egg', foodClass: 'GREEN' },
  { id: 'egg-omelette', name: 'Omelette (2 eggs)', category: 'Protein', cuisine: 'universal', calories: 148, proteinG: 12, carbsG: 1, fatG: 11, sugarG: 0, fiberG: 0, servingSize: '2 eggs', foodClass: 'GREEN' },
  { id: 'chicken-breast', name: 'Grilled Chicken Breast (100g)', category: 'Protein', cuisine: 'universal', calories: 165, proteinG: 31, carbsG: 0, fatG: 4, sugarG: 0, fiberG: 0, servingSize: '100g', foodClass: 'GREEN' },
  { id: 'tandoori-chicken', name: 'Tandoori Chicken (2 pieces)', category: 'Protein', cuisine: 'indian', calories: 220, proteinG: 28, carbsG: 6, fatG: 9, sugarG: 3, fiberG: 1, servingSize: '2 pieces', foodClass: 'GREEN' },
  { id: 'steamed-fish', name: 'Steamed Fish (150g)', category: 'Protein', cuisine: 'universal', calories: 160, proteinG: 32, carbsG: 0, fatG: 3, sugarG: 0, fiberG: 0, servingSize: '150g', foodClass: 'GREEN' },
  { id: 'whey-water', name: 'Whey Protein (1 scoop in Water)', category: 'Supplement', cuisine: 'universal', calories: 120, proteinG: 25, carbsG: 3, fatG: 1, sugarG: 1, fiberG: 0, servingSize: '1 scoop', foodClass: 'GREEN' },
  { id: 'whey-milk', name: 'Whey Protein (1 scoop in Milk)', category: 'Supplement', cuisine: 'universal', calories: 240, proteinG: 33, carbsG: 15, fatG: 5, sugarG: 11, fiberG: 0, servingSize: '1 scoop', foodClass: 'GREEN' },

  // ── FRUITS & NUTS ──
  { id: 'banana', name: 'Banana (1 medium)', category: 'Fruit', cuisine: 'universal', calories: 89, proteinG: 1, carbsG: 23, fatG: 0.3, sugarG: 12, fiberG: 2.6, servingSize: '1 medium', foodClass: 'YELLOW' },
  { id: 'apple', name: 'Apple (1 medium)', category: 'Fruit', cuisine: 'universal', calories: 95, proteinG: 0.5, carbsG: 25, fatG: 0.3, sugarG: 19, fiberG: 4.4, servingSize: '1 medium', foodClass: 'GREEN' },
  { id: 'mango', name: 'Mango (1 cup)', category: 'Fruit', cuisine: 'universal', calories: 99, proteinG: 1.4, carbsG: 25, fatG: 0.6, sugarG: 23, fiberG: 2.6, servingSize: '1 cup', foodClass: 'YELLOW' },
  { id: 'papaya', name: 'Papaya (1 cup)', category: 'Fruit', cuisine: 'universal', calories: 55, proteinG: 0.9, carbsG: 14, fatG: 0.2, sugarG: 8, fiberG: 2.5, servingSize: '1 cup', foodClass: 'GREEN' },
  { id: 'watermelon', name: 'Watermelon (1 cup)', category: 'Fruit', cuisine: 'universal', calories: 46, proteinG: 0.9, carbsG: 11.5, fatG: 0.2, sugarG: 9, fiberG: 0.6, servingSize: '1 cup', foodClass: 'GREEN' },
  { id: 'almonds', name: 'Almonds (10 pieces)', category: 'Nuts', cuisine: 'universal', calories: 70, proteinG: 2.5, carbsG: 2.5, fatG: 6, sugarG: 0.5, fiberG: 1.5, servingSize: '10 pieces', foodClass: 'GREEN' },
  { id: 'chia-seeds', name: 'Chia Seeds (1 tbsp)', category: 'Nuts', cuisine: 'universal', calories: 60, proteinG: 2, carbsG: 5, fatG: 4, sugarG: 0, fiberG: 4, servingSize: '1 tbsp', foodClass: 'GREEN' },
  { id: 'peanut-butter', name: 'Peanut Butter (1 tbsp)', category: 'Nuts', cuisine: 'universal', calories: 95, proteinG: 4, carbsG: 3, fatG: 8, sugarG: 1, fiberG: 1, servingSize: '1 tbsp', foodClass: 'GREEN' },
  { id: 'peanuts-roasted', name: 'Roasted Peanuts (28g)', category: 'Nuts', cuisine: 'universal', calories: 160, proteinG: 7, carbsG: 6, fatG: 14, sugarG: 1, fiberG: 2.5, servingSize: '28g', foodClass: 'YELLOW' },

  // ── BEVERAGES ──
  { id: 'masala-chai', name: 'Masala Chai with Milk (1 cup)', category: 'Beverage', cuisine: 'indian', calories: 90, proteinG: 3, carbsG: 12, fatG: 3, sugarG: 10, fiberG: 0, servingSize: '1 cup', foodClass: 'YELLOW' },
  { id: 'black-tea', name: 'Black Tea (no sugar)', category: 'Beverage', cuisine: 'universal', calories: 5, proteinG: 0, carbsG: 1, fatG: 0, sugarG: 0, fiberG: 0, servingSize: '1 cup', foodClass: 'GREEN' },
  { id: 'black-coffee', name: 'Black Coffee (no sugar)', category: 'Beverage', cuisine: 'universal', calories: 5, proteinG: 0.3, carbsG: 0.5, fatG: 0, sugarG: 0, fiberG: 0, servingSize: '1 cup', foodClass: 'GREEN' },
  { id: 'coconut-water', name: 'Coconut Water (1 glass)', category: 'Beverage', cuisine: 'universal', calories: 46, proteinG: 1.7, carbsG: 9, fatG: 0.5, sugarG: 6, fiberG: 2.6, servingSize: '1 glass', foodClass: 'GREEN' },
  { id: 'sattu-drink', name: 'Sattu Protein Drink (1 glass)', category: 'Beverage', cuisine: 'indian', calories: 150, proteinG: 9, carbsG: 24, fatG: 2, sugarG: 1, fiberG: 4, servingSize: '1 glass', foodClass: 'GREEN' },

  // ── SWEETS ──
  { id: 'gulab-jamun', name: 'Gulab Jamun (2 pieces)', category: 'Sweet', cuisine: 'indian', calories: 380, proteinG: 6, carbsG: 60, fatG: 13, sugarG: 40, fiberG: 0.5, servingSize: '2 pieces', foodClass: 'RED' },
  { id: 'kheer', name: 'Kheer (1 bowl)', category: 'Sweet', cuisine: 'indian', calories: 300, proteinG: 8, carbsG: 52, fatG: 8, sugarG: 38, fiberG: 0.5, servingSize: '1 bowl', foodClass: 'RED' },
  { id: 'halwa', name: 'Sooji Halwa (1 serving)', category: 'Sweet', cuisine: 'indian', calories: 350, proteinG: 5, carbsG: 55, fatG: 13, sugarG: 32, fiberG: 1, servingSize: '1 serving', foodClass: 'RED' },

  // ── SALADS & HEALTHY SIDES ──
  { id: 'green-salad', name: 'Green Salad (1 bowl)', category: 'Salad', cuisine: 'universal', calories: 50, proteinG: 2.5, carbsG: 8, fatG: 1, sugarG: 4, fiberG: 3, servingSize: '1 bowl', foodClass: 'GREEN' },
  { id: 'sprouts', name: 'Sprouted Moong Salad', category: 'Salad', cuisine: 'indian', calories: 110, proteinG: 8, carbsG: 18, fatG: 0.5, sugarG: 2, fiberG: 5, servingSize: '1 bowl', foodClass: 'GREEN' },
  { id: 'steamed-broccoli', name: 'Steamed Broccoli (1 cup)', category: 'Salad', cuisine: 'universal', calories: 55, proteinG: 3.7, carbsG: 11, fatG: 0.6, sugarG: 2, fiberG: 4, servingSize: '1 cup', foodClass: 'GREEN' },
  { id: 'sauteed-spinach', name: 'Sauteed Spinach (1 cup)', category: 'Salad', cuisine: 'universal', calories: 40, proteinG: 3, carbsG: 4, fatG: 1.5, sugarG: 0.5, fiberG: 3, servingSize: '1 cup', foodClass: 'GREEN' },
];

export function searchFoods(query: string): FoodItem[] {
  const q = query.toLowerCase().trim();
  if (!q) return FOOD_DATABASE.slice(0, 20);
  return FOOD_DATABASE.filter(
    (f) =>
      f.name.toLowerCase().includes(q) ||
      f.category.toLowerCase().includes(q) ||
      f.cuisine.toLowerCase().includes(q)
  ).slice(0, 20);
}
