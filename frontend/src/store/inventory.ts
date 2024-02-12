import create from 'zustand'

// Product type
interface Item {
    name: string;
    quantity: number;
}
export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    attributes?: {
        [key: string]: string | number
    }
}

// Type for the Zustand store state
interface StoreState {
    items: Item[];
    products: Product[];
    updateItems: () => Promise<void>;
    updateProducts: (queryString: string) => Promise<void>;
    updateActive: (name: string) => void;
    updateDistinctValues: (name: string) => void;
    error: string,
    loading: {
        items: boolean,
        products: boolean
    },
    distinctValues: {
        productName: string,
        distinctValues: {
            [key: string]: string[] | number[]
        }
    }
    total: number,
    activeProduct: string
}

const useStore = create<StoreState>((set, get) => ({
    items: [],
    products: [],
    loading: {
        items: true,
        products: true
    },
    error: '',
    total: 0,
    activeProduct: '',
    distinctValues: {
        productName: '',
        distinctValues: {}
    },
    updateItems: async () => {
        try {
            const response = await fetch(`http://localhost:3000/products/quantities`);
            if (response.ok) {
                const data = await response.json();
                set((state) => ({
                    items: data,
                    loading: {
                        ...state.loading,
                        items: false
                    },
                    activeProduct: data[0].name
                }))
            }
        } catch (error) {
            console.error('Failed to update products:', error);
            set((state) => ({
                loading: {
                    ...state.loading,
                    items: false
                },
                error: error?.toString()
            }))
        }
    },
    updateProducts: async (queryString: string) => {
        try {
            set((state) => ({ ...state, loading: { ...state.loading, products: true } }))
            const response = await fetch(`http://localhost:3000/products?${queryString}`);
            if (response.ok) {
                const data = await response.json();
                console.log('data', data)
                set((state) => ({
                    products: data.data,
                    loading: {
                        ...state.loading,
                        products: false
                    },
                    total: data.total
                }))
            }
        } catch (error) {
            console.error('Failed to update products:', error);
            set((state) => ({
                loading: { ...state.loading, products: false },
                error: error?.toString()

            }))
        }
    },
    updateDistinctValues: async (name: string) => {
        try {
            const response = await fetch(`http://localhost:3000/products/distinct-values/${name}`);
            if (response.ok) {
                const data = await response.json();
                set((state) => ({
                    distinctValues: {
                        productName: name,
                        distinctValues: data.distinctValues
                    }
                }))
            }
        } catch (error) {
            console.error('Failed to update distinct values:', error);
            set((state) => ({
                loading: {
                    ...state.loading,
                    products: false
                },
                error: error?.toString()
            }))
        }
    },
    updateActive: (name: string) => set((state) => ({ ...state, activeProduct: name }))
}));

export default useStore;
