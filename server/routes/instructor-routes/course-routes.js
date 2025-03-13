import express from 'express';
import { addNewCourse, getAllCourses, getCourseDetailsByID, updateCourseByID } from '../../controllers/instructor-controller/course-controller.js';

const instructorCourseRoutes = express.Router();

instructorCourseRoutes.post("/add", addNewCourse);
instructorCourseRoutes.get("/get", getAllCourses);
instructorCourseRoutes.get("/get/details/:id", getCourseDetailsByID);
instructorCourseRoutes.put("/update/:id", updateCourseByID);


export default instructorCourseRoutes; 