import { GraduationCap, TvMinimalPlay, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useContext, useState } from "react";
import { AuthContext } from "@/context/auth-context";

function StudentViewCommonHeader() {
  const navigate = useNavigate();
  const { resetCredentials } = useContext(AuthContext);
  const [openMenu, setOpenMenu] = useState(false);

  function handleLogout() {
    resetCredentials();
    sessionStorage.clear();
    navigate("/login");
  }

  return (
    <header className="fixed top-0 w-full z-50 bg-white border-b shadow-sm">
      <div className="max-w-[1420px] mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/home" className="flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-indigo-600" />
          <span className="font-extrabold text-lg md:text-xl text-gray-900">
            LMS LEARN
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Button
            variant="ghost"
            className="text-gray-700 hover:text-indigo-600"
            onClick={() => navigate("/courses")}
          >
            Explore Courses
          </Button>

          <div
            onClick={() => navigate("/student-courses")}
            className="flex items-center gap-2 cursor-pointer text-gray-700 hover:text-indigo-600"
          >
            <TvMinimalPlay className="h-6 w-6" />
            <span className="font-semibold">My Courses</span>
          </div>

          <Button
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
            onClick={handleLogout}
          >
            Sign Out
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-800"
          onClick={() => setOpenMenu(!openMenu)}
        >
          {openMenu ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {openMenu && (
        <div className="md:hidden absolute top-[72px] right-4 w-56 bg-white rounded-xl shadow-xl border p-4 flex flex-col gap-2">
          <Button
            variant="ghost"
            className="justify-start"
            onClick={() => {
              navigate("/courses");
              setOpenMenu(false);
            }}
          >
            Explore Courses
          </Button>

          <Button
            variant="ghost"
            className="justify-start"
            onClick={() => {
              navigate("/student-courses");
              setOpenMenu(false);
            }}
          >
            My Courses
          </Button>

          <Button
            className="bg-red-500 hover:bg-red-600 text-white"
            onClick={handleLogout}
          >
            Sign Out
          </Button>
        </div>
      )}
    </header>
  );
}

export default StudentViewCommonHeader;
