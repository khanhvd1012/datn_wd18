import { Outlet, Link } from "react-router-dom";

const AdminLayout = () => {
  return (
    <>
      <aside>
        <Link to="/admin">Dashboard</Link> <br />
        <Link to="/admin/products">Products</Link> <br />
        <Link to="/admin/users">Users</Link>
      </aside>

      <section>
        <Outlet />
      </section>
    </>
  );
};

export default AdminLayout;
