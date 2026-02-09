import { Outlet, Link } from "react-router-dom";

const ClientLayout = () => {
  return (
    <>
      <header>
        <Link to="/">Home</Link> |{" "}
        <Link to="/products">Products</Link> |{" "}
        <Link to="/cart">Cart</Link> |{" "}
        <Link to="/login">Login</Link>
      </header>

      <main>
        <Outlet />
      </main>

      <footer>© 2026 FE_DATN</footer>
    </>
  );
};

export default ClientLayout;
