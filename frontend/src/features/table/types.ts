import { Product } from "@/store/inventory.js";

export interface TableProps {
    skip: number,
    take: number,
    clickedCount: number,
    filter: string,
    sort: string,
    sortDir: 'asc' | 'desc' | ''
}

export interface TableColumn {
    key: string; // The key should match the attribute names your Product
    header: string; // What to display as the column header
    formatter?: (value: any, product: Product) => React.ReactNode; // Optional formatter function
}