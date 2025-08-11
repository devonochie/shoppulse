import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAppSelector } from '../hooks/useRedux';
import { deleteOrder } from '../store/slices/orderSlice';

const OrderHistory = () => {
  const { orders } = useAppSelector((state) => state.orders);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-success text-success-foreground';
      case 'shipped': return 'bg-info text-info-foreground';
      case 'confirmed': return 'bg-warning text-warning-foreground';
      case 'cancelled': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const deleteOrderHandler = (orderId: string) => {
    // Dispatch action to delete order
    deleteOrder(orderId);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gradient-primary mb-8">Order History</h1>
        
        {orders.length === 0 ? (
          <div className="text-center py-12 card-gradient">
            <p className="text-muted-foreground mb-4">No orders found</p>
            <Button className="btn-gradient">Start Shopping</Button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="card-gradient p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">Order #{order.id}</h3>
                    <p className="text-sm text-muted-foreground">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4 mt-2 lg:mt-0">
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 p-0"
                      onClick={() => deleteOrderHandler(order.id)}
                      title="Cancel Order"
                      >
                      <span className="sr-only">Cancel Order</span>
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-7 7m0 0l-7-7m7 7V3m0 4h6a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2h6z" />
                      </svg>
                      </Button>
                  </div>
                </div>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                  <div className="text-sm text-muted-foreground">
                    <span className="font-semibold">Items:</span> {order.items.length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span className="font-semibold">Total:</span>
                    {' '} 
                    <span className="font-semibold">${order.total.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {order.items.slice(0, 4).map((item) => (
                    <div key={`${item.id}-${item.size}-${item.color}`} className="flex space-x-3">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-16 w-16 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium truncate">{item.title}</h4>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        <p className="text-sm font-semibold">${(item.snapshot_price * item.quantity).toFixed(2)}</p>
                      </div>
                  
                    </div>
                  ))}
                </div>
                
                {order.items.length > 4 && (
                  <p className="text-sm text-muted-foreground mt-4">
                    +{order.items.length - 4} more items
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;