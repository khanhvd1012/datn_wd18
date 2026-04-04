import { Route, Routes } from "react-router-dom";

/* CLIENT */
import Home from "../pages/home/Home";
import ProductList from "../pages/product/ProductList";
import ProductDetail from "../pages/product/ProductDetail";

import Cart from "../pages/cart/Cart";
import Checkout from "../pages/Checkout";

import Orders from "../pages/Orders";
import OrderDetail from "../pages/OrderDetail";
import OrderSuccess from "../pages/OrderSuccessPage";

import PaymentBank from "../pages/PaymentBank";
import PaymentSuccess from "../pages/PaymentSuccess";
import PaymentFailed from "../pages/PaymentFailed";
import PaymentCallback from "../pages/PaymentCallback";
import PaymentMock from "../pages/PaymentMock";
import PaymentProcess from "../pages/PaymentProcess";



import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import Profile from "../pages/Profile";
import MyAccount from "../pages/account/MyAccount";

/* NEW PAGES */

import News from "../pages/news/News.tsx";
import NewsDetail from "../pages/news/NewsDetail.tsx";

import About from "../pages/about/About.tsx";
import Contact from "../pages/contact/Contact.tsx";
import PrivacyPolicy from "../pages/policies/PrivacyPolicy";
import ReturnPolicy from "../pages/policies/ReturnPolicy";
import ShippingPolicy from "../pages/policies/ShippingPolicy";
import PurchaseGuide from "../pages/policies/PurchaseGuide";
import TermsOfService from "../pages/policies/TermsOfService";

/* ADMIN */
import Users from "../pages/admin/Users";
import ProductManagement from "../pages/admin/ProductManagement";
import ProductVariantManagement from "../pages/admin/ProductVariantManagement";
import OrderManagement from "../pages/admin/OrderManagement";
import CategoryBrandManagement from "../pages/admin/CategoryBrandManagement";
import VoucherManagement from "../pages/admin/VoucherManagement";
import InventoryManagement from "../pages/admin/InventoryManagement";
import NewsManagement from "../pages/admin/NewsManagement";
import ModernDashboard from "../pages/admin/ModernDashboard";
import AdminBanner from "../pages/admin/AdminBanner";
import AdminFeedback from "../pages/admin/AdminFeedback";
import AdminReviews from "../pages/admin/AdminReviews";
import Category from "../pages/admin/Category";
import Dashboard from "../pages/admin/Dashboard";

/* LAYOUT */
import ClientLayout from "../layouts/ClientLayout";
import ModernAdminLayout from "../layouts/ModernAdminLayout";

import NotFound from "../pages/NotFound";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";

const AppRouter = () => {
  return (
    <Routes>

      {/* CLIENT */}
      <Route path="/" element={<ClientLayout />}>

        {/* PUBLIC */}
        <Route index element={<Home />} />
        <Route path="products" element={<ProductList />} />
        <Route path="product/:id" element={<ProductDetail />} />
        <Route path="news" element={<News />} />
        <Route path="news/:id" element={<NewsDetail />} />

        {/* NEW PAGES */}
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="return-policy" element={<ReturnPolicy />} />
        <Route path="shipping-policy" element={<ShippingPolicy />} />
        <Route path="purchase-guide" element={<PurchaseGuide />} />
        <Route path="terms-of-service" element={<TermsOfService />} />

        {/* AUTH */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* NEED LOGIN */}

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

        <Route
          path="profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        {/* MY ACCOUNT - Redirected to Profile */}
        <Route
          path="my-account"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        <Route
          path="order-success"
          element={
            <PrivateRoute>
              <OrderSuccess />
            </PrivateRoute>
          }
        />

        {/* PAYMENT FLOW */}
        <Route
          path="payment/bank"
          element={
            <PrivateRoute>
              <PaymentBank />
            </PrivateRoute>
          }
        />
        <Route
          path="payment/success"
          element={
            <PrivateRoute>
              <PaymentSuccess />
            </PrivateRoute>
          }
        />
        <Route
          path="payment/failed"
          element={
            <PrivateRoute>
              <PaymentFailed />
            </PrivateRoute>
          }
        />
        <Route
          path="payment/callback"
          element={
            <PrivateRoute>
              <PaymentCallback />
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
        <Route
          path="payment/process"
          element={
            <PrivateRoute>
              <PaymentProcess />
            </PrivateRoute>
          }
        />

      </Route>

      {/* ADMIN */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <ModernAdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<ModernDashboard />} />
        <Route path="products" element={<ProductVariantManagement />} />
        <Route path="product-variants" element={<ProductVariantManagement />} />
        <Route path="categories" element={<CategoryBrandManagement />} />
        <Route path="brands" element={<CategoryBrandManagement />} />
        <Route path="inventory" element={<InventoryManagement />} />
        <Route path="orders" element={<OrderManagement />} />
        <Route path="vouchers" element={<VoucherManagement />} />
        <Route path="news" element={<NewsManagement />} />
        <Route path="banners" element={<AdminBanner />} />
        <Route path="contacts" element={<AdminFeedback />} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route path="users" element={<Users />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
};

export default AppRouter;