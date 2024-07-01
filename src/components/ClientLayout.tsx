import Navbar from "./Navbar";
import { Outlet, useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

const ClientLayout = () => {
  return (
    <>
      <div className="flex flex-row mx-auto h-full">
        <main className="flex-1 overflow-hidden h-screen">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default ClientLayout;
