
import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Product from './pages/Product';
import ProductList from './components/ProductList';
import { AuthContext } from './context/Authcontext';
import Cart from './pages/Cart';
import Order from './pages/Order';
import ForgetPassword from './pages/ForgetPassword';
import ResetPassword from './pages/ResetPassword';



const App = () => {

  const ProtectedRoute = ({ children }) => {
    const { user } = useContext(AuthContext)
    return user ? children : <Navigate to="/login" />;
  };


  return (
    <Router>
      <Navbar/>
      <nav className='nav-right'>
        <Link to="/">Home</Link>
        <Link  to='/login'>Login</Link>
        <Link to='/register'>Register</Link>
        <Link to='/products'>Product</Link>
  
      </nav>
    
      <Routes>
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path='/login' element={<Login/>}/>
        <Route path='/forget_password' element={<ForgetPassword/>}/>
        <Route path='/reset-password' element={<ResetPassword/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/:id' element={<Product/>}/>
        <Route path='/products' element={<ProductList/>}/>
        <Route path="/cart" element={<ProtectedRoute><Cart/></ProtectedRoute>} />
        <Route path="/order" element={<ProtectedRoute><Order/></ProtectedRoute>} />
      </Routes>
    </Router>
  )
}

export default App
