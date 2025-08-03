import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircleIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { useAppSelector } from '../hooks/useRedux';

const OrderConfirmation = () => {
  const { currentOrder } = useAppSelector((state) => state.orders);

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-gradient p-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
          >
            <CheckCircleIcon className="h-20 w-20 text-success mx-auto mb-6" />
          </motion.div>
          
          <h1 className="text-3xl font-bold text-gradient-primary mb-4">
            Order Confirmed!
          </h1>
          
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Thank you for your purchase! Your order has been confirmed and is being processed. 
            You will receive a confirmation email shortly with your order details and tracking information.
          </p>

          {currentOrder && (
            <div className="bg-muted/30 rounded-lg p-6 mb-8 text-left max-w-md mx-auto">
              <h3 className="font-semibold mb-4">Order Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Order Number:</span>
                  <span className="font-mono">{currentOrder.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total:</span>
                  <span className="font-semibold">${currentOrder.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="text-success capitalize">{currentOrder.status}</span>
                </div>
                {currentOrder.trackingNumber && (
                  <div className="flex justify-between">
                    <span>Tracking:</span>
                    <span className="font-mono">{currentOrder.trackingNumber}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="btn-gradient" asChild>
              <Link to="/order-history">
                View Order History
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/products">Continue Shopping</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderConfirmation;