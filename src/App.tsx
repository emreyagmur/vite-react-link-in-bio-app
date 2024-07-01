import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import AuthLayout from "./components/AuthLayout";
import ClientLayout from "./components/ClientLayout";
import { Suspense } from "react";
import loadable from "@loadable/component";
import { Toaster } from "./components/ui/toaster";

const Home = loadable(() => import("./pages/home/Home"));
const Profile = loadable(() => import("./pages/profile/Profile"));
const LinkList = loadable(() => import("./pages/link/LinkList"));
const Login = loadable(() => import("./pages/auth/Login"));
const Register = loadable(() => import("./pages/auth/Register"));
const NotFoundPage = loadable(() => import("./pages/NotFoundPage"));
const ClientPage = loadable(() => import("./pages/client/ClientPage"));
const Logout = loadable(() => import("./pages/auth/Logout"));

const App = () => {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* public routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          <Route element={<ClientLayout />}>
            <Route path="/:username" element={<ClientPage />} />
          </Route>

          {/* private routes */}
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/links" element={<LinkList />} />
            <Route path="/links/:action" element={<LinkList />} />
            <Route path="/links/:action/:id" element={<LinkList />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
        <Toaster />
      </Suspense>
    </>
  );
};

export default App;
