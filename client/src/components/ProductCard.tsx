import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HeartIcon, ShoppingCartIcon, EyeIcon, StarIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppDispatch } from '../hooks/useRedux';
import { addToCart } from '../store/slices/cartSlice';
import { useToast } from '../hooks/use-toast';
import { Product } from '@/types/product.type';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    dispatch(addToCart({
      id: product.id,
      title: product.title,
      snapshot_price: product.price,
      image: product.images[0],
      quantity: 1,
      category: product.category,
      items: [],
      subtotal: 0,
      product_id: ''
    }));
    
    toast({
      title: "Added to cart",
      description: `${product.title} has been added to your cart.`,
    });
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    
    toast({
      title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      description: `${product.title} has been ${isWishlisted ? 'removed from' : 'added to'} your wishlist.`,
    });
  };

  const discountPercentage = product.originalPrice 
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <Link to={`/products/${product.id}`}>
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="card-product group relative hover:shadow-glow"
      >
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col space-y-1">
          {product.featured && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Badge className="bg-gradient-primary text-white shadow-lg">✨ Featured</Badge>
            </motion.div>
          )}
          {discountPercentage > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Badge variant="destructive" className="animate-pulse">-{discountPercentage}%</Badge>
            </motion.div>
          )}
          {product.stock === 0 && (
            <Badge variant="secondary">Out of Stock</Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0, scale: 1 }}
          whileHover={{ opacity: 1, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="absolute top-3 right-3 z-10"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleWishlist}
            className="p-2 bg-background/80 hover:bg-background backdrop-blur-sm rounded-full shadow-lg"
          >
            <motion.div
              whileTap={{ scale: 0.8 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              {isWishlisted ? (
                <HeartSolidIcon className="h-4 w-4 text-red-500" />
              ) : (
                <HeartIcon className="h-4 w-4" />
              )}
            </motion.div>
          </Button>
        </motion.div>

        {/* Product Image */}
        <div className="aspect-square overflow-hidden relative">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-muted animate-pulse" />
          )}
          <img
            src={product.images[0]}
            alt={product.title}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Hover Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end justify-center pb-4 space-x-2"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileHover={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Button
                size="sm"
                variant="secondary"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="backdrop-blur-sm bg-white/90 hover:bg-white hover:scale-105 transition-all"
              >
                <ShoppingCartIcon className="h-4 w-4 mr-1" />
                Add to Cart
              </Button>
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileHover={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                size="sm"
                variant="secondary"
                className="backdrop-blur-sm bg-white/90 hover:bg-white hover:scale-105 transition-all"
              >
                <EyeIcon className="h-4 w-4 mr-1" />
                Quick View
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-2">
          <div className="text-xs text-muted-foreground uppercase tracking-wide">
            {product.category}
          </div>
          
          <h3 className="font-semibold text-sm group-hover:text-primary transition-smooth line-clamp-2">
            {product.title}
          </h3>
          
          <div className="flex items-center space-x-1 text-sm">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {index < Math.floor(product.rating) ? (
                    <StarSolidIcon className="w-3 h-3 text-yellow-400" />
                  ) : (
                    <StarIcon className="w-3 h-3 text-muted-foreground" />
                  )}
                </motion.div>
              ))}
            </div>
            <span className="text-muted-foreground">({product.reviewCount})</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <motion.span 
                className="font-bold text-primary text-lg"
                whileHover={{ scale: 1.1 }}
              >
                ${product.price}
              </motion.span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>
            
            {product.stock > 0 && product.stock <= 10 && (
              <motion.span 
                className="text-xs text-warning"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Only {product.stock} left
              </motion.span>
            )}
          </div>

          {/* Color Options */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center space-x-1">
              {product.colors.slice(0, 4).map((color, index) => (
                <motion.div
                  key={color}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.2 }}
                  className="w-4 h-4 rounded-full border-2 border-border cursor-pointer"
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
              {product.colors.length > 4 && (
                <span className="text-xs text-muted-foreground">
                  +{product.colors.length - 4}
                </span>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  );
};

export default ProductCard;