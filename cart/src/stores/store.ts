
import { create } from "zustand";

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

interface CartItem {
  id: number;
  product: Product;
  quantity: number;
}

interface StoreState {
  products: Product[];
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: number, updatedData: Partial<Product>) => void;
  deleteProduct: (id: number) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  updateProductId: number | null;
  setUpdateProductId: (id: number | null) => void;
  searchCategory: string;
  setSearchCategory: (category: string) => void;
  productLimit: number;
  setProductLimit: (limit: number) => void;
  
 
  cart: CartItem[];
  setCart: (cart: CartItem[]) => void;
  addToCart: (product: Product, quantity?: number) => void;
  updateCartItem: (id: number, quantity: number) => void;
  removeCartItem: (id: number) => void;
  clearCart: () => void;
}

export const useSidebarStore = create<StoreState>((set) => ({
  products: [],
  setProducts: (products) => set({ products }),
  addProduct: (product) => set((state) => ({ products: [...state.products, product] })),
  updateProduct: (id, updatedData) =>
    set((state) => ({
      products: state.products.map((p) => (p.id === id ? { ...p, ...updatedData } : p)),
    })),
  deleteProduct: (id) => set((state) => ({ products: state.products.filter((p) => p.id !== id) })),
  activeTab: "products",
  setActiveTab: (tab) => set({ activeTab: tab }),
  updateProductId: null,
  setUpdateProductId: (id) => set({ updateProductId: id }),
  searchCategory: "",
  setSearchCategory: (category) => set({ searchCategory: category }),
  productLimit: 10,
  setProductLimit: (limit) => set({ productLimit: limit }),

  
  cart: [],
  setCart: (cart) => set({ cart }),
  addToCart: (product, quantity = 1) =>
    set((state) => {
      const existingItem = state.cart.find((item) => item.id === product.id);
      if (existingItem) {
        return {
          cart: state.cart.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
          ),
        };
      }
      return { cart: [...state.cart, { id: product.id, product, quantity }] };
    }),
  updateCartItem: (id, quantity) =>
    set((state) => ({
      cart: state.cart.map((item) => (item.id === id ? { ...item, quantity } : item)),
    })),
  removeCartItem: (id) => set((state) => ({ cart: state.cart.filter((item) => item.id !== id) })),
  clearCart: () => set({ cart: [] }),
}));
export default useSidebarStore