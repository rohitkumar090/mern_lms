

const express = require("express");
const {
  getCoursesByStudentId, enrollFreeCourse,
  removeStudentCourse
} = require("../../controllers/student-controller/student-courses-controller");
const authenticate = require("../../middleware/auth-middleware");

const router = express.Router();

router.get("/get/:studentId", getCoursesByStudentId);
router.post("/enroll-free",authenticate, enrollFreeCourse);
router.post("/remove", authenticate, removeStudentCourse);


module.exports = router;