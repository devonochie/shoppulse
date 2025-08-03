import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gradient-primary mb-8">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-gradient p-6">
            <h3 className="text-xl font-semibold mb-4">Products</h3>
            <p className="text-muted-foreground mb-4">Manage your product catalog</p>
            <Button className="btn-gradient" asChild>
              <Link to="/admin/products">Manage Products</Link>
            </Button>
          </div>
          
          <div className="card-gradient p-6">
            <h3 className="text-xl font-semibold mb-4">Orders</h3>
            <p className="text-muted-foreground mb-4">View and manage orders</p>
            <Button className="btn-gradient" asChild>
              <Link to="/admin/orders">Manage Orders</Link>
            </Button>
          </div>
          
          <div className="card-gradient p-6">
            <h3 className="text-xl font-semibold mb-4">Analytics</h3>
            <p className="text-muted-foreground mb-4">View sales analytics</p>
            <Button className="btn-gradient" asChild>
              <Link to="/admin/analytics">View Analytics</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;