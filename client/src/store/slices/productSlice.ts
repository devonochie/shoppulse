import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Product {
  id: string;
  name: string;
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
  createdAt: string;
  updatedAt: string;
}

interface ProductFilters {
  category: string;
  priceRange: [number, number];
  sizes: string[];
  colors: string[];
  rating: number;
  inStock: boolean;
}

interface ProductState {
  products: Product[];
  filteredProducts: Product[];
  selectedProduct: Product | null;
  filters: ProductFilters;
  searchQuery: string;
  sortBy: 'price-asc' | 'price-desc' | 'name' | 'rating' | 'newest';
  isLoading: boolean;
  error: string | null;
  categories: string[];
}

const initialState: ProductState = {
  products: [],
  filteredProducts: [],
  selectedProduct: null,
  filters: {
    category: '',
    priceRange: [0, 1000],
    sizes: [],
    colors: [],
    rating: 0,
    inStock: false,
  },
  searchQuery: '',
  sortBy: 'newest',
  isLoading: false,
  error: null,
  categories: ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Beauty'],
};

const applyFilters = (products: Product[], filters: ProductFilters, searchQuery: string) => {
  return products.filter((product) => {
    const matchesCategory = !filters.category || product.category === filters.category;
    const matchesPrice = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
    const matchesSize = filters.sizes.length === 0 || 
      (product.sizes && filters.sizes.some(size => product.sizes!.includes(size)));
    const matchesColor = filters.colors.length === 0 || 
      (product.colors && filters.colors.some(color => product.colors!.includes(color)));
    const matchesRating = product.rating >= filters.rating;
    const matchesStock = !filters.inStock || product.stock > 0;
    const matchesSearch = !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesPrice && matchesSize && matchesColor && 
           matchesRating && matchesStock && matchesSearch;
  });
};

const sortProducts = (products: Product[], sortBy: string) => {
  const sorted = [...products];
  
  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'newest':
      return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    default:
      return sorted;
  }
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
      state.filteredProducts = sortProducts(
        applyFilters(action.payload, state.filters, state.searchQuery),
        state.sortBy
      );
    },
    setSelectedProduct: (state, action: PayloadAction<Product | null>) => {
      state.selectedProduct = action.payload;
    },
    updateFilters: (state, action: PayloadAction<Partial<ProductFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.filteredProducts = sortProducts(
        applyFilters(state.products, state.filters, state.searchQuery),
        state.sortBy
      );
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.filteredProducts = sortProducts(
        applyFilters(state.products, state.filters, action.payload),
        state.sortBy
      );
    },
    setSortBy: (state, action: PayloadAction<typeof initialState.sortBy>) => {
      state.sortBy = action.payload;
      state.filteredProducts = sortProducts(
        applyFilters(state.products, state.filters, state.searchQuery),
        action.payload
      );
    },
    clearFilters: (state) => {
      state.filters = {
        category: '',
        priceRange: [0, 1000],
        sizes: [],
        colors: [],
        rating: 0,
        inStock: false,
      };
      state.searchQuery = '';
      state.filteredProducts = sortProducts(
        applyFilters(state.products, state.filters, ''),
        state.sortBy
      );
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      state.products.push(action.payload);
      state.filteredProducts = sortProducts(
        applyFilters(state.products, state.filters, state.searchQuery),
        state.sortBy
      );
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.products.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;
        state.filteredProducts = sortProducts(
          applyFilters(state.products, state.filters, state.searchQuery),
          state.sortBy
        );
      }
    },
    deleteProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter(p => p.id !== action.payload);
      state.filteredProducts = sortProducts(
        applyFilters(state.products, state.filters, state.searchQuery),
        state.sortBy
      );
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setProducts,
  setSelectedProduct,
  updateFilters,
  setSearchQuery,
  setSortBy,
  clearFilters,
  addProduct,
  updateProduct,
  deleteProduct,
  setLoading,
  setError,
} = productSlice.actions;

export default productSlice.reducer;