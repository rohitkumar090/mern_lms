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
    <header className="flex items-center justify-between p-4 border-b relative">
      {/* Logo */}
      <Link to="/home" className="flex items-center gap-2">
        <GraduationCap className="h-8 w-8" />
        <span className="font-extrabold md:text-xl text-[14px]">
          LMS LEARN
        </span>
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/courses")}
        >
          Explore Courses
        </Button>

        <div
          onClick={() => navigate("/student-courses")}
          className="flex cursor-pointer items-center gap-2"
        >
          <span className="font-semibold">My Courses</span>
          <TvMinimalPlay className="w-6 h-6" />
        </div>

        <Button onClick={handleLogout}>Sign Out</Button>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden"
        onClick={() => setOpenMenu(!openMenu)}
      >
        {openMenu ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Dropdown Menu */}
      {openMenu && (
        <div className="absolute top-16 right-4 w-52 bg-white shadow-lg rounded-md border flex flex-col gap-2 p-4 md:hidden z-50">
          <Button
            variant="ghost"
            onClick={() => {
              navigate("/courses");
              setOpenMenu(false);
            }}
          >
            Explore Courses
          </Button>

          <Button
            variant="ghost"
            onClick={() => {
              navigate("/student-courses");
              setOpenMenu(false);
            }}
          >
            My Courses
          </Button>

          <Button
            variant="destructive"
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
