import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import VideoPlayer from "@/components/video-player";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  createPaymentService,
  fetchStudentViewCourseDetailsService,
  enrollFreeCourseService,
} from "@/services";
import { Globe, Lock, PlayCircle } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

function StudentViewCourseDetailsPage() {
  const {
    studentViewCourseDetails,
    setStudentViewCourseDetails,
    currentCourseDetailsId,
    setCurrentCourseDetailsId,
    loadingState,
    setLoadingState,
  } = useContext(StudentContext);

  const { auth } = useContext(AuthContext);

  const [displayCurrentVideoFreePreview, setDisplayCurrentVideoFreePreview] =
    useState(null);
  const [showFreePreviewDialog, setShowFreePreviewDialog] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  async function fetchStudentViewCourseDetails() {
    const response = await fetchStudentViewCourseDetailsService(
      currentCourseDetailsId
    );

    if (response?.success) {
      setStudentViewCourseDetails(response?.data);
    } else {
      setStudentViewCourseDetails(null);
    }
    setLoadingState(false);
  }

  function handleSetFreePreview(item) {
    setDisplayCurrentVideoFreePreview(item?.videoUrl);
    setShowFreePreviewDialog(true);
  }

  async function handleEnrollFreeCourse() {
    try {
      const response = await enrollFreeCourseService({
        courseId: studentViewCourseDetails._id,
      });

      if (response?.data?.success) {
        toast.success("Course added successfully ");
        setTimeout(() => navigate("/student-courses"), 1200);
      }
    } catch (error) {
      const msg = error?.response?.data?.message;
      if (msg === "Already enrolled in this course") {
        toast.info("You are already enrolled ");
        navigate("/student-courses");
      } else toast.error(msg || "Failed to enroll");
    }
  }

  async function handleCreatePayment() {
    const payload = {
      userId: auth?.user?._id,
      courseId: studentViewCourseDetails?._id,
      courseTitle: studentViewCourseDetails?.title,
      coursePricing: studentViewCourseDetails?.pricing,
    };

    const response = await createPaymentService(payload);
    if (response?.success) {
      window.location.href = response?.data?.approveUrl;
    }
  }

  useEffect(() => {
    if (currentCourseDetailsId) fetchStudentViewCourseDetails();
  }, [currentCourseDetailsId]);

  useEffect(() => {
    if (id) setCurrentCourseDetailsId(id);
  }, [id]);

  useEffect(() => {
    if (!location.pathname.includes("course/details")) {
      setStudentViewCourseDetails(null);
      setCurrentCourseDetailsId(null);
    }
  }, [location.pathname]);

  if (loadingState) return <Skeleton />;

  return (
    <div className="bg-gray-100 min-h-screen pt-20">
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
        <div className="max-w-[1440px] mx-auto px-6 py-12">
          <h1 className="text-3xl font-bold mb-2">
            {studentViewCourseDetails?.title}
          </h1>
          <p className="text-lg opacity-90 mb-4">
            {studentViewCourseDetails?.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-sm opacity-90">
            <span>
              Created by {studentViewCourseDetails?.instructorName}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          <main className="flex-1 min-w-0 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>What you'll learn</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid gap-3">
                  {studentViewCourseDetails?.objectives
                    ?.split(",")
                    .map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span>{item}</span>
                      </li>
                    ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Course Description</CardTitle>
              </CardHeader>
              <CardContent>
                {studentViewCourseDetails?.description}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Course Curriculum</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {studentViewCourseDetails?.curriculum?.map((item, idx) => (
                  <div
                    key={item._id || idx}
                    onClick={
                      item.freePreview
                        ? () => handleSetFreePreview(item)
                        : undefined
                    }
                    className={`flex items-center gap-2 ${
                      item.freePreview
                        ? "cursor-pointer hover:text-indigo-600"
                        : "text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {item.freePreview ? (
                      <PlayCircle className="h-4 w-4" />
                    ) : (
                      <Lock className="h-4 w-4" />
                    )}
                    <span>{item.title}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </main>
          <aside className="w-full lg:w-[420px] shrink-0">
            <Card className="sticky top-24 shadow-lg">
              <CardContent className="p-4">
                <div className="aspect-video rounded-lg overflow-hidden bg-black mb-4">
                  {displayCurrentVideoFreePreview ? (
                    <VideoPlayer url={displayCurrentVideoFreePreview} />
                  ) : (
                    <img
                      src={studentViewCourseDetails?.image}
                      alt="course"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                <div className="text-3xl font-bold mb-4 text-indigo-600">
                  ${studentViewCourseDetails?.pricing}
                </div>

                {studentViewCourseDetails?.pricing === 0 ? (
                  <Button className="w-full hover:bg-gray-200" onClick={handleEnrollFreeCourse}>
                    Add to My Courses
                  </Button>
                ) : (
                  <Button className="w-full" onClick={handleCreatePayment}>
                    Buy Now
                  </Button>
                )}
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
      <Dialog
        open={showFreePreviewDialog}
        onOpenChange={() => {
          setShowFreePreviewDialog(false);
          setDisplayCurrentVideoFreePreview(null);
        }}
      >
        <DialogContent className="max-w-3xl bg-white">
          <DialogHeader>
            <DialogTitle>Course Preview</DialogTitle>
          </DialogHeader>
          <div className="aspect-video">
            <VideoPlayer url={displayCurrentVideoFreePreview} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default StudentViewCourseDetailsPage;
