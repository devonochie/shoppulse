/* eslint-disable @typescript-eslint/no-explicit-any */
import { Product, ProductFilters } from '@/types/product.type';
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import * as productApi from '../../api/services/product.api'


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
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
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
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload;
        state.filteredProducts = sortProducts(
          applyFilters(action.payload, state.filters, state.searchQuery),
          state.sortBy
        );
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch products';
      });
    builder
      .addCase(getProductById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch product';
      });
    builder
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
        state.filteredProducts = sortProducts(
          applyFilters(state.products, state.filters, state.searchQuery),
          state.sortBy
        );
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.error = action.payload?.message || 'Failed to create product';
      })
      .addCase(updateProductThunk.fulfilled, (state, action) => {
        const index = state.products.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
          state.filteredProducts = sortProducts(
            applyFilters(state.products, state.filters, state.searchQuery),
            state.sortBy
          );
        }
      }
      )
      .addCase(updateProductThunk.rejected, (state, action) => {
        state.error = action.payload?.message || 'Failed to update product';
      }
      )
      .addCase(deleteProductThunk.fulfilled, (state, action) => {
        state.products = state.products.filter(p => p.id !== action.meta.arg);
        state.filteredProducts = sortProducts(
          applyFilters(state.products, state.filters, state.searchQuery),
          state.sortBy
        );
      } )
      .addCase(deleteProductThunk.rejected, (state, action) => {
        state.error = action.payload?.message || 'Failed to delete product';
      })
      .addCase(searchProduct.fulfilled, (state, action) => {
        state.filteredProducts = action.payload;
      })
      .addCase(searchProduct.rejected, (state, action) => {
        state.error = action.payload?.message || 'Failed to search products';
      });
  },
});

const createProductThunk = <T, R = Product>(name: string, apiCall: (arg: T) => Promise<R>) => {
  return createAsyncThunk<R, T, { rejectValue: { message: string } }>(
    `products/${name}`,
    async (arg, { rejectWithValue }) => {
      try {
        return await apiCall(arg);
      } catch (error: any) {
        return rejectWithValue({
          message: error.response?.data?.message || `${name} failed`
        });
      }
    }
  );
};

export const createProduct = createProductThunk<Product[]>('create', productApi.createProduct)
export const getProducts = createProductThunk<ProductFilters | undefined, Product[]>('getAll', productApi.getProducts)
export const getProductById = createProductThunk<string, Product>('getById', productApi.getProductById)
export const updateProductThunk = createProductThunk<{ id: string; data: Partial<Product> }, Product>(
  'update',
  ({ id, data }) => productApi.updateProduct(id, data)
);
export const deleteProductThunk = createProductThunk<string, void>('delete', productApi.deleteProduct)
export const searchProduct = createProductThunk<string, Product[]>('search', productApi.SearchProduct); 


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