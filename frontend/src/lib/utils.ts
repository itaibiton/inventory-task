import { Product } from "@/store/inventory.js";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const getUniqueColumns = (products: Product[]) => {
  const columns = new Set(["id", "description", "price"]); // Start with common columns

  products.forEach(product => {
    product.attributes && Object.keys(product?.attributes!).forEach(attr => {
      columns.add(attr); // Add unique attribute columns
    });
  });

  return Array.from(columns); // Convert the set to an array
};
