export interface StoreItem {
  id: string;
  type: "coupon" | "merchandise" | "premium";
  name: string;
  description: string;
  price: number;
  image: string;
  discount?: number; // For coupons
  inStock?: boolean;
  category?: "apparel" | "accessories" | "books" | "other";
}

export const storeItems: StoreItem[] = [
  // Premium Membership
  {
    id: "premium",
    type: "premium",
    name: "Premium Membership",
    description: "Unlock ALL courses instantly! Get access to every course without individual unlocking. The ultimate CodeStreak experience!",
    price: 5000,
    image: "👑",
  },
  // Discount Coupons
  {
    id: "coupon-20",
    type: "coupon",
    name: "20% Off Coupon",
    description: "Get 20% discount on any locked course. Valid for one use.",
    price: 500,
    discount: 20,
    image: "🎟️",
  },
  {
    id: "coupon-30",
    type: "coupon",
    name: "30% Off Coupon",
    description: "Get 30% discount on any locked course. Valid for one use.",
    price: 800,
    discount: 30,
    image: "🎫",
  },
  {
    id: "coupon-50",
    type: "coupon",
    name: "50% Off Coupon",
    description: "Get MEGA 50% discount on any locked course. Limited time offer!",
    price: 1200,
    discount: 50,
    image: "🏷️",
  },
  {
    id: "coupon-bundle",
    type: "coupon",
    name: "Coupon Bundle (3x 20%)",
    description: "Pack of three 20% discount coupons. Best value!",
    price: 1300,
    discount: 20,
    image: "📦",
  },

  // T-Shirts
  {
    id: "tshirt-black",
    type: "merchandise",
    name: "CodeStreak Black T-Shirt",
    description: "Premium cotton t-shirt with CodeStreak Academy logo. Available in all sizes.",
    price: 1500,
    image: "👕",
    inStock: true,
    category: "apparel",
  },
  {
    id: "tshirt-white",
    type: "merchandise",
    name: "CodeStreak White T-Shirt",
    description: "Classic white t-shirt with green CodeStreak branding. Comfortable fit.",
    price: 1500,
    image: "👕",
    inStock: true,
    category: "apparel",
  },
  {
    id: "hoodie",
    type: "merchandise",
    name: "CodeStreak Hoodie",
    description: "Warm and stylish hoodie perfect for coding marathons. Premium quality.",
    price: 3000,
    image: "🧥",
    inStock: true,
    category: "apparel",
  },

  // Laptop Accessories
  {
    id: "laptop-cover-13",
    type: "merchandise",
    name: 'Laptop Sleeve 13"',
    description: "Protective laptop sleeve with CodeStreak design. Fits 13-inch laptops.",
    price: 1200,
    image: "💼",
    inStock: true,
    category: "accessories",
  },
  {
    id: "laptop-cover-15",
    type: "merchandise",
    name: 'Laptop Sleeve 15"',
    description: "Protective laptop sleeve with CodeStreak design. Fits 15-inch laptops.",
    price: 1400,
    image: "💼",
    inStock: true,
    category: "accessories",
  },
  {
    id: "laptop-stickers",
    type: "merchandise",
    name: "Coding Sticker Pack",
    description: "Set of 10 premium coding-themed stickers. Perfect for laptops!",
    price: 300,
    image: "✨",
    inStock: true,
    category: "accessories",
  },

  // Books & Notebooks
  {
    id: "custom-notebook",
    type: "merchandise",
    name: "Customized Coding Notebook",
    description: "Premium hardcover notebook with your name embossed. 200 pages.",
    price: 800,
    image: "📓",
    inStock: true,
    category: "books",
  },
  {
    id: "data-structures-book",
    type: "merchandise",
    name: "Data Structures Handbook",
    description: "Comprehensive guide to data structures and algorithms. Physical book.",
    price: 2000,
    image: "📚",
    inStock: true,
    category: "books",
  },
  {
    id: "coding-diary",
    type: "merchandise",
    name: "CodeStreak Learning Diary",
    description: "Track your coding journey with this beautiful personalized diary.",
    price: 600,
    image: "📔",
    inStock: true,
    category: "books",
  },

  // Other Accessories
  {
    id: "water-bottle",
    type: "merchandise",
    name: "CodeStreak Water Bottle",
    description: "Stay hydrated while coding! Insulated stainless steel bottle (750ml).",
    price: 900,
    image: "🍶",
    inStock: true,
    category: "other",
  },
  {
    id: "coffee-mug",
    type: "merchandise",
    name: "Programmer's Coffee Mug",
    description: "Ceramic mug with funny coding quotes. Dishwasher safe.",
    price: 500,
    image: "☕",
    inStock: true,
    category: "other",
  },
  {
    id: "mousepad",
    type: "merchandise",
    name: "Gaming Mouse Pad XL",
    description: "Extended mouse pad with CodeStreak design. Anti-slip rubber base.",
    price: 700,
    image: "🖱️",
    inStock: true,
    category: "other",
  },
  {
    id: "backpack",
    type: "merchandise",
    name: "CodeStreak Backpack",
    description: "Spacious laptop backpack with multiple compartments. Water resistant.",
    price: 2500,
    image: "🎒",
    inStock: true,
    category: "other",
  },
  {
    id: "badge-set",
    type: "merchandise",
    name: "Achievement Badge Set",
    description: "Collectible metal badges representing your coding achievements.",
    price: 400,
    image: "🏅",
    inStock: true,
    category: "other",
  },
];

export const getItemById = (id: string) => {
  return storeItems.find((item) => item.id === id);
};

export const getCoupons = () => {
  return storeItems.filter((item) => item.type === "coupon");
};

export const getMerchandise = () => {
  return storeItems.filter((item) => item.type === "merchandise");
};

export const getMerchandiseByCategory = (category: string) => {
  return storeItems.filter((item) => item.type === "merchandise" && item.category === category);
};