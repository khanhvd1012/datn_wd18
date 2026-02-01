import { Route, Routes } from 'react-router-dom'
import ClientLayout from '../layout/ClientLayout'
import Home from '../pages/home/Home'
import ProductList from '../pages/product/ProductList'
import Cart from '../pages/cart/Cart'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import AdminLayout from '../layout/AdminLayout'
import Dashboard from '../pages/admin/Dashboard'
import AdminProducts from '../pages/admin/AdminProducts'
import Users from '../pages/admin/Users'
import NotFound from '../pages/NotFound'
import ProductDetail from '../pages/product/ProductDetail'

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
      </Route>

      {/* NOT FOUND */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRouter