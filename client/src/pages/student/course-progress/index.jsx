import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VideoPlayer from "@/components/video-player";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  getCurrentCourseProgressService,
  markLectureAsViewedService,
  resetCourseProgressService,
} from "@/services";
import { Check, ChevronLeft, Play } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useNavigate, useParams } from "react-router-dom";

function StudentViewCourseProgressPage() {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const { studentCurrentCourseProgress, setStudentCurrentCourseProgress } =
    useContext(StudentContext);

  const [lockCourse, setLockCourse] = useState(false);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [showCourseCompleteDialog, setShowCourseCompleteDialog] =
    useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const { id } = useParams();

  async function fetchCurrentCourseProgress() {
    const response = await getCurrentCourseProgressService(auth?.user?._id, id);

    if (response?.success) {
      if (!response?.data?.isPurchased) {
        setLockCourse(true);
        return;
      }

      setStudentCurrentCourseProgress({
        courseDetails: response?.data?.courseDetails,
        progress: response?.data?.progress,
      });

      if (response?.data?.completed) {
        setCurrentLecture(response?.data?.courseDetails?.curriculum[0]);
        setShowCourseCompleteDialog(true);
        setShowConfetti(true);
        return;
      }

      if (response?.data?.progress?.length === 0) {
        setCurrentLecture(response?.data?.courseDetails?.curriculum[0]);
      } else {
        const lastViewedIndex = response?.data?.progress.reduceRight(
          (acc, item, index) =>
            acc === -1 && item.viewed ? index : acc,
          -1
        );

        setCurrentLecture(
          response?.data?.courseDetails?.curriculum[lastViewedIndex + 1]
        );
      }
    }
  }

  async function updateCourseProgress() {
    if (!currentLecture) return;

    const response = await markLectureAsViewedService(
      auth?.user?._id,
      studentCurrentCourseProgress?.courseDetails?._id,
      currentLecture._id
    );

    if (response?.success) fetchCurrentCourseProgress();
  }

  async function handleRewatchCourse() {
    const response = await resetCourseProgressService(
      auth?.user?._id,
      studentCurrentCourseProgress?.courseDetails?._id
    );

    if (response?.success) {
      setCurrentLecture(null);
      setShowConfetti(false);
      setShowCourseCompleteDialog(false);
      fetchCurrentCourseProgress();
    }
  }

  useEffect(() => {
    fetchCurrentCourseProgress();
  }, [id]);

  useEffect(() => {
    if (currentLecture?.progressValue === 1) {
      updateCourseProgress();
    }
  }, [currentLecture?.progressValue]);

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 15000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  return (
    <div className="flex flex-col bg-[#1c1d1f] text-white overflow-hidden">
      {showConfetti && <Confetti />}

      <div className=" border-gray-700 border-b">
        <div className="flex items-center gap-4 p-4  max-w-[1420px] m-auto">
        <Button
          onClick={() => navigate("/student-courses")}
          variant="ghost"
          size="sm"
          className=" hover:text-indigo-600"
        >
          <ChevronLeft className="h-4 w-4 mr-2 text-indigo-600 font-extrabold" />
          Back to My Courses
        </Button>

        <h1 className="text-lg font-semibold">
          {studentCurrentCourseProgress?.courseDetails?.title}
        </h1>
      </div>
      </div>

      <div className="flex flex-col md:flex-row flex-1 overflow-hidden max-w-[1420px] m-auto" >
        <div className="flex flex-col flex-1">
          {!currentLecture ? (
            <div className="flex items-center justify-center h-[300px] text-gray-400">
              Loading lecture...
            </div>
          ) : (
            <>
              <div className="w-full aspect-video max-h-[380px] md:max-h-[400px] px-4 pt-4 pb-2">
                <div className="h-full rounded-xl overflow-hidden border border-gray-700">
                  <VideoPlayer
                    url={currentLecture.videoUrl}
                    onProgressUpdate={setCurrentLecture}
                    progressData={currentLecture}
                  />
                </div>
              </div>

              <div className="p-4 mb-4 pb-3">
                <h2 className="text-lg font-semibold leading-tight">
                  {currentLecture.title}
                </h2>
              </div>
            </>
          )}
        </div>

        <div
          className={`w-full md:w-[380px] flex flex-col border-t md:border-t-0 md:border-l border-gray-700 ${
            showCourseCompleteDialog
              ? "blur-sm pointer-events-none"
              : ""
          }`}
        >
          <Tabs defaultValue="content" className="flex flex-col h-full">
            <TabsList className="grid grid-cols-2 h-14 bg-[#1c1d1f]">
              <TabsTrigger value="content" className="hover:text-indigo-600">Course Content</TabsTrigger>
              <TabsTrigger value="overview" className="hover:text-indigo-600">Overview</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="flex-1">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-3">
                  {studentCurrentCourseProgress?.courseDetails?.curriculum.map(
                    (item) => {
                      const viewed =
                        studentCurrentCourseProgress?.progress?.find(
                          (p) => p.lectureId === item._id
                        )?.viewed;

                      return (
                        <div
                          key={item._id}
                          onClick={() => setCurrentLecture(item)}
                          className="flex items-center gap-3 cursor-pointer rounded-lg px-3 py-2 hover:bg-white/5"
                        >
                          {viewed ? (
                            <Check className="h-4 w-4 text-green-400" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                          <span className="text-sm font-medium">
                            {item.title}
                          </span>
                        </div>
                      );
                    }
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* OVERVIEW */}
            <TabsContent value="overview" className="flex-1">
              <ScrollArea className="h-full">
                <div className="p-4 text-sm text-gray-300 leading-relaxed">
                  {studentCurrentCourseProgress?.courseDetails?.description}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* LOCK COURSE */}
      <Dialog open={lockCourse}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>You can't view this page</DialogTitle>
            <DialogDescription>
              Please purchase this course to get access
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* COURSE COMPLETE */}
      <Dialog
        open={showCourseCompleteDialog}
        onOpenChange={(open) => {
          setShowCourseCompleteDialog(open);
          if (!open) setShowConfetti(false);
        }}
      >
        <DialogContent className="text-center bg-white text-black rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Congratulations 🎉
            </DialogTitle>
            <DialogDescription className="mt-3">
              You have successfully completed this course
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3 mt-6">
            <Button onClick={() => navigate("/student-courses")}>
              Go to My Courses
            </Button>
            <Button variant="outline" onClick={handleRewatchCourse}>
              Rewatch Course
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default StudentViewCourseProgressPage;
