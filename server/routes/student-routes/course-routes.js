import express from 'express';
import { checkCoursePurchaseInfo, getAllStudentViewCourses, getStudentViewCourseDetails } from '../../controllers/student-controller/course-controller.js';

const studentViewCourseRoutes = express.Router();

studentViewCourseRoutes.get("/get", getAllStudentViewCourses);
studentViewCourseRoutes.get("/get/details/:id", getStudentViewCourseDetails);
studentViewCourseRoutes.get("/purchase-info/:id/:studentId", checkCoursePurchaseInfo);
export default studentViewCourseRoutes;