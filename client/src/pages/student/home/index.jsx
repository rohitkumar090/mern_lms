

import { courseCategories } from "@/config";
import banner from "../../../assets/banner-img.png";
import { Button } from "@/components/ui/button";
import { useContext, useEffect } from "react";
import { StudentContext } from "@/context/student-context";
import {
  checkCoursePurchaseInfoService,
  fetchStudentViewCourseListService,
} from "@/services";
import { AuthContext } from "@/context/auth-context";
import { useNavigate } from "react-router-dom";

function StudentHomePage() {
  const { studentViewCoursesList, setStudentViewCoursesList } =
    useContext(StudentContext);
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleNavigateToCoursesPage(getCurrentId) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      category: [getCurrentId],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    navigate("/courses");
  }

  async function fetchAllStudentViewCourses() {
    const response = await fetchStudentViewCourseListService();
    if (response?.success) setStudentViewCoursesList(response?.data);
  }

  async function handleCourseNavigate(getCurrentCourseId) {
    const response = await checkCoursePurchaseInfoService(
      getCurrentCourseId,
      auth?.user?._id
    );

    if (response?.success) {
      if (response?.data) {
        navigate(`/course-progress/${getCurrentCourseId}`);
      } else {
        navigate(`/course/details/${getCurrentCourseId}`);
      }
    }
  }

  useEffect(() => {
    fetchAllStudentViewCourses();
  }, []);

  return (
    <div className="pt-20">

      {/* HERO */}
      <section className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white">
        <div className="max-w-[1420px] mx-auto px-4 py-14 flex flex-col lg:flex-row items-center gap-8">
          <div className="lg:w-1/2">
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4">
              Learning that gets you
            </h1>
            <p className="text-lg md:text-xl opacity-90">
              Skills for your present and your future. Start learning today.
            </p>
          </div>
          <img
            src={banner}
            className="w-full max-w-xl rounded-xl shadow-lg"
          />
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="bg-gray-100">
        <div className="max-w-[1420px] mx-auto px-4 py-10">
          <h2 className="text-2xl font-bold mb-6">
            Course Categories
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {courseCategories.map((cat) => (
              <Button
                key={cat.id}
                variant="outline"
                className="hover:bg-indigo-50"
                onClick={() => handleNavigateToCoursesPage(cat.id)}
              >
                {cat.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="max-w-[1420px] mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">
          Featured Courses
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {studentViewCoursesList?.map((course) => (
            <div
              key={course._id}
              onClick={() => handleCourseNavigate(course._id)}
              className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition cursor-pointer"
            >
              <img
                src={course.image}
                className="h-40 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold mb-1 line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {course.instructorName}
                </p>
                <p className="font-bold mt-2 text-indigo-600">
                  ${course.pricing}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default StudentHomePage;