import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import { AuthProvider } from './context/Authcontext';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';



// import { CartProvider } from './contexts/CartContext';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <OrderProvider>
        <App />
        </OrderProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);
