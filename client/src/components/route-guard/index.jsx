import { Navigate, useLocation, Outlet } from "react-router-dom";

function RouteGuard({ authenticated, user, element }) {
  const location = useLocation();

  // Not logged in → auth page
  if (!authenticated && !location.pathname.includes("/auth")) {
    return <Navigate to="/auth" />;
  }

  // Logged in student trying instructor or auth page
  if (
    authenticated &&
    user?.role !== "instructor" &&
    (location.pathname.includes("/instructor") ||
      location.pathname.includes("/auth"))
  ) {
    return <Navigate to="/home" />;
  }

  // Instructor trying to access student pages
  if (
    authenticated &&
    user?.role === "instructor" &&
    !location.pathname.includes("/instructor")
  ) {
    return <Navigate to="/instructor" />;
  }

  // ✅ MOST IMPORTANT LINE
  // If element exists → render it
  // Else → render nested routes (Outlet)
  return element ? element : <Outlet />;
}

export default RouteGuard;
