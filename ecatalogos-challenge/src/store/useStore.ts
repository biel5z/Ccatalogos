import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product } from '../types';
import { productsData } from '../data/products';

interface StoreState {
  cart: CartItem[];
  currentProductIndex: number;
  
  // Actions
  setPackQuantity: (productReference: string, quantity: number) => void;
  nextProduct: () => void;
  prevProduct: () => void;
  setCurrentProduct: (index: number) => void;
  
  // Getters
  getProductTotal: (product: Product) => { items: number; price: number };
  getGrandTotal: () => { items: number; price: number };
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      cart: [],
      currentProductIndex: 0,

      setPackQuantity: (productReference, quantity) => set((state) => {
        const existingItemIndex = state.cart.findIndex(item => item.productReference === productReference);
        let newCart = [...state.cart];

        if (quantity <= 0) {
          if (existingItemIndex >= 0) newCart.splice(existingItemIndex, 1);
        } else {
          if (existingItemIndex >= 0) {
            newCart[existingItemIndex].packs = quantity;
          } else {
            newCart.push({ productReference, packs: quantity });
          }
        }
        return { cart: newCart };
      }),

      nextProduct: () => set((state) => ({
        currentProductIndex: (state.currentProductIndex + 1) % productsData.length
      })),

      prevProduct: () => set((state) => ({
        currentProductIndex: (state.currentProductIndex - 1 + productsData.length) % productsData.length
      })),

      setCurrentProduct: (index) => set({ currentProductIndex: index }),

      getProductTotal: (product) => {
        const cartItem = get().cart.find(item => item.productReference === product.reference);
        const packs = cartItem ? cartItem.packs : 0;
        
        let itemsPerPack = 0;
        let pricePerPack = 0;

        product.skus.forEach(sku => {
          itemsPerPack += sku.minQuantity; 
          pricePerPack += parseFloat(sku.price) * sku.minQuantity;
        });

        return {
          items: packs * itemsPerPack,
          price: packs * pricePerPack
        };
      },

      getGrandTotal: () => {
        let totalItems = 0;
        let totalPrice = 0;

        get().cart.forEach(cartItem => {
          const product = productsData.find(p => p.reference === cartItem.productReference);
          if (product) {
            let itemsPerPack = 0;
            let pricePerPack = 0;
            product.skus.forEach(sku => {
              itemsPerPack += sku.minQuantity;
              pricePerPack += parseFloat(sku.price) * sku.minQuantity;
            });
            
            totalItems += cartItem.packs * itemsPerPack;
            totalPrice += cartItem.packs * pricePerPack;
          }
        });

        return { items: totalItems, price: totalPrice };
      }
    }),
    {
      name: 'ecatalogos-storage',
    }
  )
);