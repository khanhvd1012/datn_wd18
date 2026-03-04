import { Route, Routes } from 'react-router-dom'
import Home from '../pages/home/Home'
import ProductList from '../pages/product/ProductList'
import Cart from '../pages/cart/Cart'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import Users from '../pages/admin/Users'
import NotFound from '../pages/NotFound'
import ClientLayout from '../layouts/ClientLayout'
import AdminLayout from '../layouts/AdminLayout'
import AdminProducts from '../pages/admin/AdminProducts'
import ProductDetail from '../pages/product/ProductDetail'
import Banner from '../pages/admin/Banner'
import Category from '../pages/admin/Category'
import Dashboard from '../pages/admin/Dashboard'

const AppRouter = () => {
  return (
    <Routes>
      {/* CLIENT */}
      <Route path="/" element={<ClientLayout />}>
        <Route index element={<Home />} /> 
        <Route path="products" element={<ProductList />} />
        <Route path="cart" element={<Cart />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="product/:id" element={<ProductDetail />} />
      </Route>

      {/* ADMIN */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="users" element={<Users />} />
        <Route path="banner" element={<Banner />} />
        <Route path="category" element={<Category />} />
      </Route>

      {/* NOT FOUND */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRouter