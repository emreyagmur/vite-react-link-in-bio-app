import Layout from "@/components/Layout";
import Loadable from "@/components/Loadable";

const Profile = Loadable(() => import("./Profile"));

const profilePageRoutes = [
  {
    path: "profile",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Profile />,
      },
    ],
  },
];

export default profilePageRoutes;
