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
      <div className="bg-red-500 text-white text-center p-2">
  FOOTER TEST BLOCK
</div>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

export default StudentViewCommonLayout;
