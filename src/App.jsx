import React from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

// Layouts
import AppShell from "@/components/layout/AppShell";

// Pages
import Landing    from "@/pages/Landing";
import Onboarding from "@/pages/Onboarding";
import Home       from "@/pages/Home";
import Entry      from "@/pages/Entry";
import SlipDetail from "@/pages/SlipDetail";
import Reflect    from "@/pages/Reflect";
import Feed       from "@/pages/Feed";
import Science    from "@/pages/Science";
import Profile     from "@/pages/Profile";
import Reflections from "@/pages/Reflections";
import Upgrade     from "@/pages/Upgrade";
import NotFound   from "@/pages/NotFound";

function PrivateRoute({ children }) {
  const user    = useAuthStore(s => s.user);
  const loading = useAuthStore(s => s.loading);
  if (loading) return null; // wait for session rehydration
  if (!user) return <Navigate to="/" replace />;
  return children;
}

function PublicRoute({ children }) {
  const user    = useAuthStore(s => s.user);
  const loading = useAuthStore(s => s.loading);
  if (loading) return null;
  if (user) return <Navigate to="/home" replace />;
  return children;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicRoute><Landing /></PublicRoute>,
  },
  {
    path: "/onboarding",
    element: <PrivateRoute><Onboarding /></PrivateRoute>,
  },
  {
    element: <PrivateRoute><AppShell /></PrivateRoute>,
    children: [
      { path: "/home",        element: <Home /> },
      { path: "/entry",       element: <Entry /> },
      { path: "/slip/:id",    element: <SlipDetail /> },
      { path: "/reflect/:id", element: <Reflect /> },
      { path: "/feed",        element: <Feed /> },
      { path: "/science",     element: <Science /> },
      { path: "/profile",      element: <Profile /> },
      { path: "/reflections", element: <Reflections /> },
      { path: "/upgrade",     element: <Upgrade /> },
    ],
  },
  { path: "*", element: <NotFound /> },
]);

export default function App() {
  const rehydrate = useAuthStore(s => s.rehydrate);
  React.useEffect(() => { rehydrate(); }, []);

  return <RouterProvider router={router} />;
}