import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserIcon, EnvelopeIcon, ShieldCheckIcon, PencilIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppSelector } from '../hooks/useRedux';

const Profile = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    { label: 'Orders Placed', value: '24', icon: '📦' },
    { label: 'Total Spent', value: '$1,247', icon: '💰' },
    { label: 'Wishlist Items', value: '8', icon: '❤️' },
    { label: 'Reviews Written', value: '12', icon: '⭐' },
  ];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gradient-primary mb-4">Profile Dashboard</h1>
          <p className="text-muted-foreground">Manage your account and track your activity</p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="card-gradient pulse-glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserIcon className="w-6 h-6 text-primary" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white text-2xl font-bold float-animation">
                    {user?.username?.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{user?.username}</h3>
                    <p className="text-muted-foreground">{user?.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <ShieldCheckIcon className="w-4 h-4 text-success" />
                      <span className="text-sm text-success capitalize">{user?.role} Account</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="hover:scale-105 transition-transform">
                    <PencilIcon className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <UserIcon className="w-4 h-4" />
                      Name
                    </label>
                    <div className="p-3 bg-muted/50 rounded-lg">{user?.username}</div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <EnvelopeIcon className="w-4 h-4" />
                      Email
                    </label>
                    <div className="p-3 bg-muted/50 rounded-lg">{user?.email}</div>
                  </div>
                </div>
                
                <Button className="btn-gradient hover:scale-105 transition-transform">
                  <Cog6ToothIcon className="w-4 h-4 mr-2" />
                  Account Settings
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <Card className="card-gradient">
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-background/50 rounded-lg hover:bg-primary/5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{stat.icon}</span>
                      <span className="text-sm font-medium">{stat.label}</span>
                    </div>
                    <span className="text-lg font-bold text-gradient-primary">{stat.value}</span>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            <Card className="card-gradient">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Order #1234 shipped</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <span>Review posted for Headphones</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-secondary-warm rounded-full"></div>
                    <span>Wishlist updated</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;