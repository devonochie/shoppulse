import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { CreditCardIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAppSelector, useAppDispatch } from '../hooks/useRedux';
import { clearCart } from '../store/slices/cartSlice';
import { addOrder, createOrder } from '../store/slices/orderSlice';
import { useToast } from '../hooks/use-toast';

interface CheckoutFormData {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardName: string;
}

const Checkout = () => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  
  const { items, total, itemCount, shippingCost, tax } = useAppSelector((state) => state.cart);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormData>();

  const subtotal = items.reduce((sum, item) => sum + item.snapshot_price * item.quantity, 0);

  const onSubmit = async (data: CheckoutFormData) => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const order = {
      id: `order-${Date.now()}`,
      user_id: user?.id || 'guest',
      items,
      subtotal,
      shipping: shippingCost,
      tax,
      total,
      status: 'confirmed' as const,
      shipping_method: 'standard' as const,
      billing_address: {
        first_name: data.firstName,
        last_name: data.lastName,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        country: data.country,
        phone: data.phone,
      },
      shipping_address: {
        first_name: data.firstName,
        last_name: data.lastName,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        country: data.country,
        phone: data.phone,
      },
      payment_method: paymentMethod === 'card' ? 'Credit Card' : 'PayPal',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tracking: {
        carrier: 'UPS',
        tracking_number: `TRK${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        actual_delivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        estimated_delivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      payment_transaction_id: `txn-${Date.now()}`,
      notes: '',
      coupon_code: '', 
    };
    
    dispatch(addOrder(order));
    dispatch(createOrder(order));
    dispatch(clearCart());
    
    toast({
      title: "Order placed successfully!",
      description: "Thank you for your purchase. You will receive a confirmation email shortly.",
    });
    
    navigate('/order-confirmation');
    setIsProcessing(false);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="card-gradient p-12">
            <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8">
              Add some items to your cart to proceed with checkout.
            </p>
            <Button size="lg" className="btn-gradient" onClick={() => navigate('/products')}>
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gradient-primary mb-8">Checkout</h1>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Checkout Form */}
            <div className="space-y-8">
              {/* Contact Information */}
              <div className="card-gradient p-6">
                <h2 className="text-xl font-semibold mb-6">Contact Information</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register('email', { required: 'Email is required' })}
                      className={errors.email ? 'border-destructive' : ''}
                      defaultValue={user?.email || ''}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="card-gradient p-6">
                <h2 className="text-xl font-semibold mb-6">Shipping Address</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        {...register('firstName', { required: 'First name is required' })}
                        className={errors.firstName ? 'border-destructive' : ''}
                      />
                      {errors.firstName && (
                        <p className="text-sm text-destructive mt-1">{errors.firstName.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        {...register('lastName', { required: 'Last name is required' })}
                        className={errors.lastName ? 'border-destructive' : ''}
                      />
                      {errors.lastName && (
                        <p className="text-sm text-destructive mt-1">{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      {...register('address', { required: 'Address is required' })}
                      className={errors.address ? 'border-destructive' : ''}
                    />
                    {errors.address && (
                      <p className="text-sm text-destructive mt-1">{errors.address.message}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        {...register('city', { required: 'City is required' })}
                        className={errors.city ? 'border-destructive' : ''}
                      />
                      {errors.city && (
                        <p className="text-sm text-destructive mt-1">{errors.city.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        {...register('state', { required: 'State is required' })}
                        className={errors.state ? 'border-destructive' : ''}
                      />
                      {errors.state && (
                        <p className="text-sm text-destructive mt-1">{errors.state.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="zipCode">ZIP Code *</Label>
                      <Input
                        id="zipCode"
                        {...register('zipCode', { required: 'ZIP code is required' })}
                        className={errors.zipCode ? 'border-destructive' : ''}
                      />
                      {errors.zipCode && (
                        <p className="text-sm text-destructive mt-1">{errors.zipCode.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="country">Country *</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="us">United States</SelectItem>
                          <SelectItem value="ca">Canada</SelectItem>
                          <SelectItem value="uk">United Kingdom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      {...register('phone', { required: 'Phone number is required' })}
                      className={errors.phone ? 'border-destructive' : ''}
                    />
                    {errors.phone && (
                      <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="card-gradient p-6">
                <h2 className="text-xl font-semibold mb-6">Payment Method</h2>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center">
                      <CreditCardIcon className="h-4 w-4 mr-2" />
                      Credit/Debit Card
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <Label htmlFor="paypal">PayPal</Label>
                  </div>
                </RadioGroup>

                {paymentMethod === 'card' && (
                  <div className="mt-6 space-y-4">
                    <div>
                      <Label htmlFor="cardNumber">Card Number *</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        {...register('cardNumber', { required: 'Card number is required' })}
                        className={errors.cardNumber ? 'border-destructive' : ''}
                      />
                      {errors.cardNumber && (
                        <p className="text-sm text-destructive mt-1">{errors.cardNumber.message}</p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiryDate">Expiry Date *</Label>
                        <Input
                          id="expiryDate"
                          placeholder="MM/YY"
                          {...register('expiryDate', { required: 'Expiry date is required' })}
                          className={errors.expiryDate ? 'border-destructive' : ''}
                        />
                        {errors.expiryDate && (
                          <p className="text-sm text-destructive mt-1">{errors.expiryDate.message}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV *</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          {...register('cvv', { required: 'CVV is required' })}
                          className={errors.cvv ? 'border-destructive' : ''}
                        />
                        {errors.cvv && (
                          <p className="text-sm text-destructive mt-1">{errors.cvv.message}</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="cardName">Name on Card *</Label>
                      <Input
                        id="cardName"
                        {...register('cardName', { required: 'Name on card is required' })}
                        className={errors.cardName ? 'border-destructive' : ''}
                      />
                      {errors.cardName && (
                        <p className="text-sm text-destructive mt-1">{errors.cardName.message}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="card-gradient p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.size}-${item.color}`} className="flex space-x-3">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-16 w-16 object-cover rounded-lg bg-muted"
                      />
                      <div className="flex-1 space-y-1">
                        <h3 className="text-sm font-medium">{item.title}</h3>
                        <div className="text-xs text-muted-foreground">
                          Qty: {item.quantity}
                          {(item.size || item.color) && (
                            <span>
                              {' • '}
                              {item.size && `Size: ${item.size}`}
                              {item.size && item.color && ', '}
                              {item.color && `Color: ${item.color}`}
                            </span>
                          )}
                        </div>
                        <div className="text-sm font-semibold">
                          ${(item.snapshot_price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal ({itemCount} items)</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex justify-between text-lg font-semibold mb-6">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                
                <Button
                  type="submit"
                  size="lg"
                  className="w-full btn-gradient"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                  ) : (
                    <ShieldCheckIcon className="h-5 w-5 mr-2" />
                  )}
                  {isProcessing ? 'Processing...' : 'Place Order'}
                </Button>
                
                <div className="mt-4 text-xs text-muted-foreground text-center">
                  🔒 Your payment information is secure and encrypted
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;