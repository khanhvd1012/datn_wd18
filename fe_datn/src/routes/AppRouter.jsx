import { Route, Routes } from "react-router-dom";

// CLIENT
import Home from "../pages/home/Home";
import ProductList from "../pages/product/ProductList";
import ProductDetail from "../pages/product/ProductDetail";

import Cart from "../pages/cart/Cart";
import Checkout from "../pages/Checkout";

import Orders from "../pages/Orders";
import OrderDetail from "../pages/OrderDetail";
import OrderSuccess from "../pages/OrderSuccess";
import PaymentBank from "../pages/PaymentBank";
import PaymentProcess from "../pages/PaymentProcess";
import PaymentMock from "../pages/PaymentMock";
import PaymentSuccess from "../pages/PaymentSuccess";
import PaymentFailed from "../pages/PaymentFailed";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Profile from "../pages/Profile";

// ADMIN
import Users from "../pages/admin/Users";
import AdminProducts from "../pages/admin/AdminProducts";
import Banner from "../pages/admin/Banner";
import Category from "../pages/admin/Category";
import Dashboard from "../pages/admin/Dashboard";

// LAYOUT
import ClientLayout from "../layouts/ClientLayout";
import AdminLayout from "../layouts/AdminLayout";

import NotFound from "../pages/NotFound";
import PrivateRoute from "./PrivateRoute";

const AppRouter = () => {
  return (
    <Routes>

      {/* CLIENT */}
      <Route path="/" element={<ClientLayout />}>

        {/* ai cũng xem được */}
        <Route index element={<Home />} />
        <Route path="products" element={<ProductList />} />
        <Route path="product/:id" element={<ProductDetail />} />

        {/* cần login */}
        <Route
          path="cart"
          element={
            <PrivateRoute>
              <Cart />
            </PrivateRoute>
          }
        />

        <Route
          path="checkout"
          element={
            <PrivateRoute>
              <Checkout />
            </PrivateRoute>
          }
        />

        <Route
          path="orders"
          element={
            <PrivateRoute>
              <Orders />
            </PrivateRoute>
          }
        />

        <Route
          path="orders/:id"
          element={
            <PrivateRoute>
              <OrderDetail />
            </PrivateRoute>
          }
        />

        <Route path="order-success" element={<OrderSuccess />} />

        {/* PAYMENT */}
        <Route
          path="payment/bank"
          element={
            <PrivateRoute>
              <PaymentBank />
            </PrivateRoute>
          }
        />
        <Route
          path="payment/process"
          element={
            <PrivateRoute>
              <PaymentProcess />
            </PrivateRoute>
          }
        />
        <Route
          path="payment/mock"
          element={
            <PrivateRoute>
              <PaymentMock />
            </PrivateRoute>
          }
        />
        <Route path="payment/success" element={<PaymentSuccess />} />
        <Route path="payment/failed" element={<PaymentFailed />} />

        {/* AUTH */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* PROFILE */}
        <Route
          path="profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

      </Route>

      {/* ADMIN */}
      <Route path="/admin" element={<AdminLayout />}>

        <Route index element={<Dashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="users" element={<Users />} />
        <Route path="banner" element={<Banner />} />
        <Route path="category" element={<Category />} />

      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
};

export default AppRouter;