import Layout from "@/components/Layout";
import Loadable from "@/components/Loadable";

const Home = Loadable(() => import("./Home"));

const homePageRoutes = [
  {
    path: "",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
    ],
  },
];

export default homePageRoutes;
