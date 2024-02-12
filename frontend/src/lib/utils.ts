import { TableColumn } from "@/features/table/types.js";
import { Product } from "@/store/inventory.js";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


