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
import AdminProducts from '../pages/admin/Products'
import { Dashboard } from '@mui/icons-material'
// import ProductDetail from '../pages/product/ProductDetail'

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
        {/* <Route path="product/:id" element={<ProductDetail />} /> */}
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