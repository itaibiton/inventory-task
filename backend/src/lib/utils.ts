import { Product } from "../entity/Product";

export function isDirectAttribute(key: string): key is keyof Product {
    const directKeys: (keyof Product)[] = ['name', 'price', 'description'];
    return directKeys.includes(key as keyof Product);
}
