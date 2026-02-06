import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { filterOptions } from "@/config";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  checkCoursePurchaseInfoService,
  fetchStudentViewCourseListService,
} from "@/services";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function createSearchParamsHelper(filterParams) {
  const queryParams = [];
  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      queryParams.push(`${key}=${value.join(",")}`);
    }
  }
  return queryParams.join("&");
}

function StudentViewCoursesPage() {
  const [sort, setSort] = useState("price-lowtohigh");
  const [filters, setFilters] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    studentViewCoursesList,
    setStudentViewCoursesList,
    loadingState,
    setLoadingState,
  } = useContext(StudentContext);

  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleFilterOnChange(sectionId, option) {
    const updated = { ...filters };
    if (!updated[sectionId]) updated[sectionId] = [];

    if (updated[sectionId].includes(option.id)) {
      updated[sectionId] = updated[sectionId].filter(
        (id) => id !== option.id
      );
    } else {
      updated[sectionId].push(option.id);
    }

    setFilters(updated);
    sessionStorage.setItem("filters", JSON.stringify(updated));
  }

  async function fetchAllStudentViewCourses(filters, sort) {
    const query = new URLSearchParams({
      ...filters,
      sortBy: sort,
    });

    const response = await fetchStudentViewCourseListService(query);
    if (response?.success) {
      setStudentViewCoursesList(response?.data);
      setLoadingState(false);
    }
  }

  async function handleCourseNavigate(courseId) {
    const response = await checkCoursePurchaseInfoService(
      courseId,
      auth?.user?._id
    );

    if (response?.success) {
      navigate(
        response.data
          ? `/course-progress/${courseId}`
          : `/course/details/${courseId}`
      );
    }
  }

  useEffect(() => {
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
  }, []);

  useEffect(() => {
    const qs = createSearchParamsHelper(filters);
    setSearchParams(new URLSearchParams(qs));
  }, [filters]);

  useEffect(() => {
    fetchAllStudentViewCourses(filters, sort);
  }, [filters, sort]);

  useEffect(() => {
    return () => sessionStorage.removeItem("filters");
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen pt-20">
      <div className="max-w-[1420px] mx-auto px-4 py-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">
          All Courses
        </h1>

        <div className="flex flex-col lg:flex-row gap-6">

          <aside className="w-full lg:w-[280px] shrink-0">
            <Card className="sticky top-24">
              <CardContent className="p-4 space-y-6">
                {Object.keys(filterOptions).map((section) => (
                  <div key={section}>
                    <h3 className="font-semibold mb-3 uppercase text-sm">
                      {section}
                    </h3>
                    <div className="space-y-2">
                      {filterOptions[section].map((option) => (
                        <Label
                          key={option.id}
                          className="flex items-center gap-2 text-sm cursor-pointer"
                        >
                          <Checkbox
                            checked={
                              filters?.[section]?.includes(option.id) || false
                            }
                            onCheckedChange={() =>
                              handleFilterOnChange(section, option)
                            }
                          />
                          {option.label}
                        </Label>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </aside>

          <main className="flex-1 space-y-4">
            {loadingState ? (
              <Skeleton className="h-40 w-full" />
            ) : studentViewCoursesList?.length > 0 ? (
              studentViewCoursesList.map((course) => (
                <Card
                  key={course._id}
                  onClick={() => handleCourseNavigate(course._id)}
                  className="cursor-pointer hover:shadow-lg transition bg-white"
                >
                  <CardContent className="p-4 flex flex-col sm:flex-row gap-4">
                    <div className="sm:w-[260px] aspect-video rounded-lg overflow-hidden bg-gray-200">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">
                        {course.title}
                      </CardTitle>

                      <p className="text-sm text-gray-600 mb-1">
                        By{" "}
                        <span className="font-medium">
                          {course.instructorName}
                        </span>
                      </p>

                      <p className="text-sm text-gray-500 mb-2">
                        {course.curriculum?.length} Lectures •{" "}
                        {course.level?.toUpperCase()} Level
                      </p>

                      <p className="font-bold text-indigo-600 text-lg">
                        ${course.pricing}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-20">
                <h2 className="text-2xl font-semibold">
                  No Courses Found
                </h2>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default StudentViewCoursesPage;
