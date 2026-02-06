import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  fetchStudentBoughtCoursesService,
  removeStudentCourseService,
} from "@/services";
import { Watch } from "lucide-react";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function StudentCoursesPage() {
  const { auth } = useContext(AuthContext);
  const { studentBoughtCoursesList, setStudentBoughtCoursesList } =
    useContext(StudentContext);
  const navigate = useNavigate();

  async function fetchStudentBoughtCourses() {
    const response = await fetchStudentBoughtCoursesService(auth?.user?._id);
    if (response?.success) {
      setStudentBoughtCoursesList(response?.data);
    }
  }

  async function handleRemoveCourse(courseId) {
    const confirmRemove = window.confirm(
      "Are you sure you want to remove this course?"
    );
    if (!confirmRemove) return;

    try {
      const response = await removeStudentCourseService(courseId);
      if (response?.data?.success) {
        toast.success("Course removed successfully");
        fetchStudentBoughtCourses();
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to remove course"
      );
    }
  }

  useEffect(() => {
    fetchStudentBoughtCourses();
  }, []);

  return (
    <>
      <section className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white mt-16">
        <div className="mx-auto max-w-[1420px] px-4 py-10">
          <h1 className="text-3xl font-extrabold">My Courses</h1>
          <p className="text-white mt-1">
            Continue learning where you left off
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1420px] px-4 py-12">
        {studentBoughtCoursesList &&
        studentBoughtCoursesList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {studentBoughtCoursesList.map((course) => (
              <Card
                key={course.courseId}
                className="flex flex-col rounded-xl overflow-hidden hover:shadow-xl transition-shadow"
              >
                <CardContent className="p-4 flex-grow">
                  <div className="aspect-video mb-4 rounded-lg overflow-hidden bg-gray-200">
                    <img
                      src={course?.courseImage}
                      alt={course?.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <h3 className="font-semibold text-lg mb-1 line-clamp-2">
                    {course?.title}
                  </h3>

                  <p className="text-sm text-gray-600">
                    {course?.instructorName}
                  </p>
                </CardContent>

                <CardFooter className="flex gap-2 p-4 pt-0">
                  <Button
                    onClick={() =>
                      navigate(`/course-progress/${course?.courseId}`)
                    }
                    className="flex-1"
                  >
                    <Watch className="mr-2 h-4 w-4" />
                    Watch
                  </Button>

                  <Button
                    variant="destructive"
                    onClick={() =>
                      handleRemoveCourse(course.courseId)
                    }
                  >
                    Remove
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <h2 className="text-2xl font-semibold mb-2">
              No courses found
            </h2>
            <p className="text-gray-500 mb-6">
              You haven’t enrolled in any courses yet
            </p>
            <Button onClick={() => navigate("/courses")}>
              Explore Courses
            </Button>
          </div>
        )}
      </section>
    </>
  );
}

export default StudentCoursesPage;
