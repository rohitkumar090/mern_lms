

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "@/config";
import { InstructorContext } from "@/context/instructor-context";
import { Delete, Edit } from "lucide-react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { deleteCourseService } from "@/services";


function InstructorCourses({ listOfCourses }) {
  const navigate = useNavigate();
  const {
    setCurrentEditedCourseId,
    setCourseLandingFormData,
    setCourseCurriculumFormData,
  } = useContext(InstructorContext);

  async function handleDeleteCourse(courseId) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course?"
    );

    if (!confirmDelete) return;

    try {
      const response = await deleteCourseService(courseId);

      if (response?.data?.success) {
        toast.success("Course deleted successfully");
        navigate(0); // ✅ now works
      } else {
        toast.error("Failed to delete course");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  }


  return (
    <Card>
      <CardHeader className="flex justify-between flex-row items-center">
        <CardTitle className="text-xl md:text-3xl font-bold md:font-extrabold">All Courses</CardTitle>
        <Button
          onClick={() => {
            setCurrentEditedCourseId(null);
            setCourseLandingFormData(courseLandingInitialFormData);
            setCourseCurriculumFormData(courseCurriculumInitialFormData);
            navigate("/instructor/create-new-course");
          }}
          className=" p-2 md:p-6"
        >
          Create New Course
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listOfCourses && listOfCourses.length > 0
                ? listOfCourses.map((course) => (
                  <TableRow>
                    <TableCell className="font-medium">
                      {course?.title}
                    </TableCell>
                    <TableCell>{course?.students?.length}</TableCell>
                    <TableCell>
                      ${course?.students?.length * course?.pricing}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        onClick={() => {
                          navigate(`/instructor/edit-course/${course?._id}`);
                        }}
                        variant="ghost"
                        size="sm"
                      >
                        <Edit className="h-6 w-6" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCourse(course._id)}
                      >
                        <Delete className="h-6 w-6 text-black" />
                      </Button>

                    </TableCell>
                  </TableRow>
                ))
                : null}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

export default InstructorCourses;