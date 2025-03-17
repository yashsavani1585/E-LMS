import mongoose from "mongoose";
import Course from "../../models/Course.js";
// import Student from "../../models/Student.js"; // Ensure this is imported
import StudentCourses from "../../models/StudentCourses.js";

export const getAllStudentViewCourses = async (req, res) => {
  try {
    const {
      category = [],
      level = [],
      primaryLanguage = [],
      sortBy = "price-lowtohigh",
    } = req.query;

    console.log(req.query, "req.query");

    let filters = {};
    if (category.length) {
      filters.category = { $in: category.split(",") };
    }
    if (level.length) {
      filters.level = { $in: level.split(",") };
    }
    if (primaryLanguage.length) {
      filters.primaryLanguage = { $in: primaryLanguage.split(",") };
    }

    let sortParam = {};
    switch (sortBy) {
      case "price-lowtohigh":
        sortParam.pricing = 1;

        break;
      case "price-hightolow":
        sortParam.pricing = -1;

        break;
      case "title-atoz":
        sortParam.title = 1;

        break;
      case "title-ztoa":
        sortParam.title = -1;

        break;

      default:
        sortParam.pricing = 1;
        break;
    }

    const coursesList = await Course.find(filters).sort(sortParam);

    res.status(200).json({
      success: true,
      data: coursesList,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};





export const getStudentViewCourseDetails = async (req, res) => {
  try {
    const { id: courseId } = req.params;  // ✅ Correctly extracting 'courseId'

    // Validate courseId before querying
    if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {  // ✅ Check if defined
      return res.status(400).json({
        success: false,
        message: "Invalid or missing course ID",
      });
    }

    // Fetch course details
    const courseDetails = await Course.findById(courseId);  // ✅ Use 'courseId'

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "No course details found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      data: courseDetails,
    });
  } catch (e) {
    console.error("Error fetching course details:", e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};




  

export const checkCoursePurchaseInfo = async (req, res) => {
  const { id: courseId, studentId } = req.params;

  try {
    // Validate courseId and studentId
    if (!courseId || !studentId) {
      return res.status(400).json({ success: false, message: "Course ID and Student ID are required" });
    }

    // Fetch the course from the database
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // Check if the student has purchased the course
    const hasPurchased = course.students.some(
      (student) => student.studentId.toString() === studentId
    );

    if (!hasPurchased) {
      return res.status(200).json({ success: true, hasPurchased: false });
    }

    // If the student has purchased the course, return additional details
    const studentDetails = course.students.find(
      (student) => student.studentId.toString() === studentId
    );

    res.status(200).json({
      success: true,
      hasPurchased: true,
      purchaseDetails: {
        studentName: studentDetails.studentName,
        paidAmount: studentDetails.paidAmount,
      },
    });
  } catch (error) {
    console.error("❌ Error checking course purchase info:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

