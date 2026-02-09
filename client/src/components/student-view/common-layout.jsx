import { Outlet, useLocation } from "react-router-dom";
import StudentViewCommonHeader from "./header";
import Footer from "./Footer";

function StudentViewCommonLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      {!location.pathname.includes("course-progress") && (
        <StudentViewCommonHeader />
      )}

      <Outlet />

      <Footer />
    </div>
  );
}

export default StudentViewCommonLayout;
