import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, HeartIcon, ShoppingCartIcon, ShareIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { setSelectedProduct } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';
import { mockProducts } from '../data/mockData';
import { useToast } from '../hooks/use-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  
  const { selectedProduct } = useAppSelector((state) => state.products);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const product = mockProducts.find(p => p.id === id);
    if (product) {
      dispatch(setSelectedProduct(product));
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      }
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0]);
      }
    }
  }, [id, dispatch]);

  const handleAddToCart = () => {
    if (!selectedProduct) return;
    
    if (selectedProduct.sizes && selectedProduct.sizes.length > 0 && !selectedSize) {
      toast({
        title: "Please select a size",
        variant: "destructive",
      });
      return;
    }
    
    if (selectedProduct.colors && selectedProduct.colors.length > 0 && !selectedColor) {
      toast({
        title: "Please select a color",
        variant: "destructive",
      });
      return;
    }

    dispatch(addToCart({
      id: selectedProduct.id,
      name: selectedProduct.name,
      price: selectedProduct.price,
      image: selectedProduct.images[0],
      quantity,
      size: selectedSize || undefined,
      color: selectedColor || undefined,
      category: selectedProduct.category,
    }));
    
    toast({
      title: "Added to cart",
      description: `${selectedProduct.name} has been added to your cart.`,
    });
  };

  if (!selectedProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-muted-foreground mb-4">Product not found</div>
          <Button onClick={() => navigate('/products')}>
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  const discountPercentage = selectedProduct.originalPrice 
    ? Math.round((1 - selectedProduct.price / selectedProduct.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-2xl bg-muted">
              <motion.img
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={selectedProduct.images[selectedImage]}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {selectedProduct.images.length > 1 && (
              <div className="flex space-x-2">
                {selectedProduct.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square w-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? 'border-primary' : 'border-border'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${selectedProduct.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant="outline">{selectedProduct.category}</Badge>
                {selectedProduct.featured && (
                  <Badge className="bg-gradient-primary text-white">Featured</Badge>
                )}
                {discountPercentage > 0 && (
                  <Badge variant="destructive">-{discountPercentage}% OFF</Badge>
                )}
              </div>
              
              <h1 className="text-3xl font-bold mb-4">{selectedProduct.name}</h1>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <span
                        key={index}
                        className={`text-lg ${
                          index < Math.floor(selectedProduct.rating)
                            ? 'text-yellow-400'
                            : 'text-muted-foreground'
                        }`}
                      >
                        ⭐
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {selectedProduct.rating} ({selectedProduct.reviewCount} reviews)
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-primary">
                  ${selectedProduct.price}
                </span>
                {selectedProduct.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    ${selectedProduct.originalPrice}
                  </span>
                )}
              </div>

              <p className="text-muted-foreground leading-relaxed">
                {selectedProduct.description}
              </p>
            </div>

            {/* Size Selection */}
            {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-3">Size</h3>
                <div className="flex space-x-2">
                  {selectedProduct.sizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {selectedProduct.colors && selectedProduct.colors.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-3">Color: {selectedColor}</h3>
                <div className="flex space-x-2">
                  {selectedProduct.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border-2 ${
                        selectedColor === color ? 'border-primary' : 'border-border'
                      }`}
                      style={{
                        backgroundColor: color.toLowerCase() === 'white' ? '#ffffff' : 
                                       color.toLowerCase() === 'black' ? '#000000' :
                                       color.toLowerCase() === 'blue' ? '#3b82f6' :
                                       color.toLowerCase() === 'red' ? '#ef4444' :
                                       color.toLowerCase() === 'green' ? '#22c55e' :
                                       color.toLowerCase() === 'gray' ? '#6b7280' :
                                       color.toLowerCase() === 'brown' ? '#a3781b' :
                                       color.toLowerCase() === 'pink' ? '#ec4899' :
                                       '#6b7280'
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Stock */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-3">Quantity</h3>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.min(selectedProduct.stock, quantity + 1))}
                    disabled={quantity >= selectedProduct.stock}
                  >
                    +
                  </Button>
                </div>
              </div>
              
              <div className="text-sm">
                {selectedProduct.stock > 0 ? (
                  <span className="text-success">
                    ✓ In stock ({selectedProduct.stock} available)
                  </span>
                ) : (
                  <span className="text-destructive">Out of stock</span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                size="lg"
                className="w-full btn-gradient"
                onClick={handleAddToCart}
                disabled={selectedProduct.stock === 0}
              >
                <ShoppingCartIcon className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              
              <div className="flex space-x-3">
                <Button variant="outline" className="flex-1">
                  <HeartIcon className="h-4 w-4 mr-2" />
                  Add to Wishlist
                </Button>
                <Button variant="outline" className="flex-1">
                  <ShareIcon className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6">
              <div className="card-gradient p-6">
                <p className="text-muted-foreground leading-relaxed">
                  {selectedProduct.description}
                </p>
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.tags.map((tag) => (
                      <Badge key={tag} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="specifications" className="mt-6">
              <div className="card-gradient p-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Category</span>
                    <span className="text-muted-foreground">{selectedProduct.category}</span>
                  </div>
                  {selectedProduct.subcategory && (
                    <div className="flex justify-between">
                      <span className="font-medium">Subcategory</span>
                      <span className="text-muted-foreground">{selectedProduct.subcategory}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="font-medium">Stock</span>
                    <span className="text-muted-foreground">{selectedProduct.stock} units</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Rating</span>
                    <span className="text-muted-foreground">{selectedProduct.rating}/5</span>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <div className="card-gradient p-6">
                <div className="text-center text-muted-foreground">
                  Reviews feature coming soon...
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;