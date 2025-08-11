/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FunnelIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { setProducts, updateFilters, setSearchQuery, setSortBy, clearFilters } from '../store/slices/productSlice';
import { mockProducts } from '../data/mockData';
import ProductCard from '../components/ProductCard';
import { clearCartThunk } from '@/store/slices/cartSlice';

const Products = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  
  const { 
    filteredProducts, 
    filters, 
    searchQuery, 
    sortBy, 
    categories,
    isLoading 
  } = useAppSelector((state) => state.products);

  useEffect(() => {
    // Initialize with mock data
    dispatch(setProducts(mockProducts));
    
    // Apply URL search params
    const urlSearch = searchParams.get('search');
    const urlCategory = searchParams.get('category');
    
    if (urlSearch) {
      dispatch(setSearchQuery(urlSearch));
    }
    
    if (urlCategory) {
      dispatch(updateFilters({ category: urlCategory }));
    }
  }, [dispatch, searchParams]);
    
  const handleFilterChange = (filterType: string, value: any) => {
    dispatch(updateFilters({ [filterType]: value }));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    dispatch(clearCartThunk())
    setSearchParams({});
  };

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const availableColors = ['Black', 'White', 'Blue', 'Red', 'Green', 'Gray', 'Brown', 'Pink'];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gradient-primary mb-2">Products</h1>
            <p className="text-muted-foreground">
              {filteredProducts.length} products found
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            {/* Search */}
            <div className="relative">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                className="w-64"
              />
            </div>
            
            {/* Sort */}
            <Select value={sortBy} onValueChange={(value: any) => dispatch(setSortBy(value))}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="name">Name: A to Z</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden"
            >
              <FunnelIcon className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <motion.div
            initial={false}
            animate={{
              width: showFilters ? '320px' : '0px',
              opacity: showFilters ? 1 : 0,
            }}
            className={`overflow-hidden lg:w-80 lg:opacity-100 ${
              showFilters ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="card-gradient p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Filters</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="text-sm"
                >
                  Clear All
                </Button>
              </div>

              {/* Category Filter */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Category</Label>
                <Select
                  value={filters.category || "all"}
                  onValueChange={(value) => handleFilterChange('category', value === "all" ? "" : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div>
                <Label className="text-sm font-medium mb-3 block">
                  Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
                </Label>
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) => handleFilterChange('priceRange', value)}
                  max={1000}
                  step={10}
                  className="w-full"
                />
              </div>

              {/* Size Filter */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Size</Label>
                <div className="grid grid-cols-3 gap-2">
                  {availableSizes.map((size) => (
                    <div key={size} className="flex items-center space-x-2">
                      <Checkbox
                        id={`size-${size}`}
                        checked={filters.sizes.includes(size)}
                        onCheckedChange={(checked) => {
                          const newSizes = checked
                            ? [...filters.sizes, size]
                            : filters.sizes.filter((s) => s !== size);
                          handleFilterChange('sizes', newSizes);
                        }}
                      />
                      <Label htmlFor={`size-${size}`} className="text-sm">
                        {size}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Color Filter */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Color</Label>
                <div className="grid grid-cols-2 gap-2">
                  {availableColors.map((color) => (
                    <div key={color} className="flex items-center space-x-2">
                      <Checkbox
                        id={`color-${color}`}
                        checked={filters.colors.includes(color)}
                        onCheckedChange={(checked) => {
                          const newColors = checked
                            ? [...filters.colors, color]
                            : filters.colors.filter((c) => c !== color);
                          handleFilterChange('colors', newColors);
                        }}
                      />
                      <Label htmlFor={`color-${color}`} className="text-sm">
                        {color}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <Label className="text-sm font-medium mb-3 block">
                  Minimum Rating: {filters.rating} stars
                </Label>
                <Slider
                  value={[filters.rating]}
                  onValueChange={(value) => handleFilterChange('rating', value[0])}
                  max={5}
                  step={0.5}
                  className="w-full"
                />
              </div>

              {/* In Stock Filter */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="in-stock"
                  checked={filters.inStock}
                  onCheckedChange={(checked) => handleFilterChange('inStock', checked)}
                />
                <Label htmlFor="in-stock" className="text-sm">
                  In Stock Only
                </Label>
              </div>
            </div>
          </motion.div>

          {/* Products Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="card-gradient animate-pulse">
                    <div className="aspect-square bg-muted rounded-lg mb-4" />
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded" />
                      <div className="h-4 bg-muted rounded w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-muted-foreground mb-4">No products found</div>
                <Button onClick={handleClearFilters}>Clear Filters</Button>
              </div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;