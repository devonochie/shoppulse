import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrashIcon, MinusIcon, PlusIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAppSelector, useAppDispatch } from '../hooks/useRedux';
import { updateQuantity, removeFromCart, clearCart } from '../store/slices/cartSlice';

const Cart = () => {
  const dispatch = useAppDispatch();
  const { items, total, itemCount, shippingCost, tax } = useAppSelector((state) => state.cart);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleUpdateQuantity = (id: string, quantity: number, size?: string, color?: string) => {
    dispatch(updateQuantity({ id, quantity, size, color }));
  };

  const handleRemoveItem = (id: string, size?: string, color?: string) => {
    dispatch(removeFromCart({ id, size, color }));
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-gradient p-12"
          >
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-6xl mb-6"
            >
              🛒
            </motion.div>
            <h1 className="text-3xl font-bold mb-4 text-gradient-primary">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8">
              Looks like you haven't added any items to your cart yet. Start exploring our amazing products!
            </p>
            <Button size="lg" className="btn-gradient hover:scale-105 transition-transform" asChild>
              <Link to="/products">
                Start Shopping
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-gradient-primary mb-2">
              Shopping Cart
            </h1>
            <p className="text-muted-foreground">
              {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => dispatch(clearCart())}
            className="text-destructive hover:text-destructive hover:scale-105 transition-transform"
          >
            Clear Cart
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <motion.div
                key={`${item.id}-${item.size}-${item.color}`}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="card-gradient p-6"
              >
                <div className="flex space-x-4">
                  <Link to={`/products/${item.id}`} className="flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-24 w-24 object-cover rounded-lg bg-muted hover:scale-105 transition-transform"
                    />
                  </Link>
                  
                  <div className="flex-1 space-y-2">
                    <Link
                      to={`/products/${item.id}`}
                      className="font-medium hover:text-primary transition-smooth"
                    >
                      {item.name}
                    </Link>
                    
                    <div className="text-sm text-muted-foreground">
                      {item.category}
                      {(item.size || item.color) && (
                        <span>
                          {' • '}
                          {item.size && `Size: ${item.size}`}
                          {item.size && item.color && ', '}
                          {item.color && `Color: ${item.color}`}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-semibold text-primary">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity - 1, item.size, item.color)
                            }
                          >
                            <MinusIcon className="h-3 w-3" />
                          </Button>
                          <span className="text-sm w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity + 1, item.size, item.color)
                            }
                          >
                            <PlusIcon className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          onClick={() => handleRemoveItem(item.id, item.size, item.color)}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1"
          >
            <div className="card-gradient p-6 sticky top-24 pulse-glow">
              <h2 className="text-xl font-semibold mb-6 text-gradient-primary">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal ({itemCount} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>
                    {shippingCost === 0 ? (
                      <span className="text-success">Free</span>
                    ) : (
                      `$${shippingCost.toFixed(2)}`
                    )}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                
                {subtotal < 50 && (
                  <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
                    💡 Add ${(50 - subtotal).toFixed(2)} more to get free shipping!
                  </div>
                )}
              </div>
              
              <div className="space-y-3 mt-6">
                <Button size="lg" className="w-full btn-gradient hover:scale-105 transition-transform" asChild>
                  <Link to="/checkout">
                    Proceed to Checkout
                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                
                <Button variant="outline" className="w-full hover:scale-105 transition-transform" asChild>
                  <Link to="/products">Continue Shopping</Link>
                </Button>
              </div>
              
              <div className="mt-6 text-xs text-muted-foreground space-y-2">
                <motion.div 
                  className="flex items-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="mr-2">🔒</span>
                  Secure checkout with SSL encryption
                </motion.div>
                <motion.div 
                  className="flex items-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="mr-2">📦</span>
                  Free returns within 30 days
                </motion.div>
                <motion.div 
                  className="flex items-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="mr-2">🚚</span>
                  Fast delivery in 2-5 business days
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Cart;