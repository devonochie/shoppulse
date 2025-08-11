export interface Product {
    id?: string;
    title: string;
    description: string;
    price: number;
    originalPrice?: number;
    images: string[];
    category: string;
    subcategory?: string;
    sizes?: string[];
    colors?: string[];
    stock: number;
    rating: number;
    reviewCount: number;
    featured: boolean;
    tags: string[];
    createdAt?: string;
    updatedAt?: string;
    
}

export interface ProductFilters {
    category: string;
    priceRange: [number, number];
    sizes: string[];
    colors: string[];
    rating: number;
    inStock: boolean;
}