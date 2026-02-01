import { Link, Outlet } from "react-router-dom";

const ClientLayout = () => {
  return (
    <div>
      <header>
        <Link to="/">Home</Link> |{" "}
        <Link to="/products">Products</Link> |{" "}
        <Link to="/login">Login</Link>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default ClientLayout;
