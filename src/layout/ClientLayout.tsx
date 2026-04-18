import { Outlet } from "react-router-dom";
import Header from "../components/Header";

const ClientLayout = () => {
  return (
    <>
      <Header />
      

      <main style={{ padding: 20 }}>
        <Outlet />
      </main>
    </>
  );
};

export default ClientLayout;
