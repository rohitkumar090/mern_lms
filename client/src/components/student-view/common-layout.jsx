import { Outlet, useLocation } from "react-router-dom";
import StudentViewCommonHeader from "./header";
import Footer from "./Footer";

function StudentViewCommonLayout() {
  const location = useLocation();

  return (
    
    <div className="min-h-screen flex flex-col">
      
      {/* HEADER */}
      {!location.pathname.includes("course-progress") && (
        <StudentViewCommonHeader />
      )}

      {/* MAIN CONTENT */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

export default StudentViewCommonLayout;
