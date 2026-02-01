import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Banner from "../components/Banner";

const ClientLayout = () => {
  return (
    <>
      <Header />
      <Banner />

      <main style={{ padding: 20 }}>
        <Outlet />
      </main>
    </>
  );
};

export default ClientLayout;
