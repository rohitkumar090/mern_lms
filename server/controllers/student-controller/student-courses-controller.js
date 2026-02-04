

const StudentCourses = require("../../models/StudentCourses");
const Course = require("../../models/Course");

const getCoursesByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;
    const studentBoughtCourses = await StudentCourses.findOne({
      userId: studentId,
    });

    res.status(200).json({
      success: true,
      data: studentBoughtCourses.courses,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const enrollFreeCourse = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const { courseId } = req.body;


    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }


    let studentCourses = await StudentCourses.findOne({ userId });

    if (!studentCourses) {
      studentCourses = new StudentCourses({
        userId,
        courses: [],
      });
    }


    const alreadyEnrolled = studentCourses.courses.find(
      (c) => c.courseId === courseId
    );

    if (alreadyEnrolled) {
      return res.status(400).json({
        success: false,
        message: "You are already enrolled in this course",
      });
    }


    studentCourses.courses.push({
      courseId: course._id.toString(),
      title: course.title,
      instructorId: course.instructorId,
      instructorName: course.instructorName,
      dateOfPurchase: new Date(),
      courseImage: course.image,
    });

    await studentCourses.save();

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        $addToSet: {
          students: {
            studentId: userId,
            studentName: req.user.userName,
            studentEmail: req.user.userEmail,
            paidAmount: course.pricing || 0,
          },
        },
      },
      { new: true }
    );

    console.log("UPDATED COURSE STUDENTS =>", updatedCourse.students);

    return res.status(200).json({
      success: true,
      message: "Course added successfully",
    });
  } catch (error) {
    console.error("ENROLL ERROR =>", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const removeStudentCourse = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const { courseId } = req.body;

    // 1️⃣ StudentCourses se course remove
    await StudentCourses.findOneAndUpdate(
      { userId },
      {
        $pull: {
          courses: { courseId },
        },
      }
    );

    // 2️⃣ Course.students se student remove
    await Course.findByIdAndUpdate(courseId, {
      $pull: {
        students: { studentId: userId },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Course removed successfully",
    });
  } catch (error) {
    console.error("REMOVE COURSE ERROR =>", error);
    return res.status(500).json({
      success: false,
      message: "Failed to remove course",
    });
  }
};


module.exports = { getCoursesByStudentId, enrollFreeCourse, removeStudentCourse };