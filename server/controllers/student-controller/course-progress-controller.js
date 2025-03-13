import mongoose from "mongoose";
import CourseProgress from "../../models/CourseProgress.js";
import Course from "../../models/Course.js";
import StudentCourses from "../../models/StudentCourses.js";

// Mark a lecture as viewed
export const markCurrentLectureAsViewed = async (req, res) => {
  try {
    const { userId, courseId, lectureId } = req.body;

    // Validate courseId and lectureId
    if (
      !mongoose.Types.ObjectId.isValid(courseId) ||
      !mongoose.Types.ObjectId.isValid(lectureId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID or lecture ID",
      });
    }

    // Fetch the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check if the lecture exists in the course curriculum
    const lectureExists = course.curriculum.some(
      (lecture) => lecture._id.toString() === lectureId
    );

    if (!lectureExists) {
      return res.status(400).json({
        success: false,
        message: "Lecture not found in the course curriculum",
      });
    }

    // Find or create course progress
    let progress = await CourseProgress.findOne({ userId, courseId });
    if (!progress) {
      progress = new CourseProgress({
        userId,
        courseId,
        lecturesProgress: [
          {
            lectureId,
            viewed: true,
            dateViewed: new Date(),
          },
        ],
      });
    } else {
      const lectureProgress = progress.lecturesProgress.find(
        (item) => item.lectureId.toString() === lectureId
      );

      if (lectureProgress) {
        lectureProgress.viewed = true;
        lectureProgress.dateViewed = new Date();
      } else {
        progress.lecturesProgress.push({
          lectureId,
          viewed: true,
          dateViewed: new Date(),
        });
      }
    }

    await progress.save();

    // Check if all lectures are viewed
    const allLecturesViewed =
      progress.lecturesProgress.length === course.curriculum.length &&
      progress.lecturesProgress.every((item) => item.viewed);

    if (allLecturesViewed) {
      progress.completed = true;
      progress.completionDate = new Date();
      await progress.save();
    }

    res.status(200).json({
      success: true,
      message: "Lecture marked as viewed",
      data: progress,
    });
  } catch (error) {
    console.error("Error marking lecture as viewed:", error);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

// Get current course progress
export const getCurrentCourseProgress = async (req, res) => {
  try {
    const { userId, courseId } = req.params;

    // Validate courseId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    // Find the student's purchased courses
    const studentPurchasedCourses = await StudentCourses.findOne({ userId });

    if (!studentPurchasedCourses) {
      return res.status(200).json({
        success: true,
        data: { isPurchased: false },
        message: "You need to purchase this course to access it.",
      });
    }

    // Check if the course is purchased
    const isPurchased = studentPurchasedCourses.courses.some(
      (item) => item.courseId.toString() === courseId
    );

    if (!isPurchased) {
      return res.status(200).json({
        success: true,
        data: { isPurchased: false },
        message: "You need to purchase this course to access it.",
      });
    }

    // Fetch the course progress
    const currentUserCourseProgress = await CourseProgress.findOne({
      userId,
      courseId,
    });

    // Fetch the course details
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // If no progress exists, return the course details with empty progress
    if (
      !currentUserCourseProgress ||
      currentUserCourseProgress?.lecturesProgress?.length === 0
    ) {
      return res.status(200).json({
        success: true,
        message: "No progress found, you can start watching the course",
        data: {
          courseDetails: course,
          progress: [],
          isPurchased: true,
          completed: false,
        },
      });
    }

    // Return the course progress
    res.status(200).json({
      success: true,
      data: {
        courseDetails: course,
        progress: currentUserCourseProgress.lecturesProgress,
        completed: currentUserCourseProgress.completed,
        completionDate: currentUserCourseProgress.completionDate,
        isPurchased: true,
      },
    });
  } catch (error) {
    console.error("Error fetching course progress:", error);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

// Reset course progress
export const resetCurrentCourseProgress = async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    // Validate courseId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    // Find the course progress
    const progress = await CourseProgress.findOne({ userId, courseId });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: "Progress not found!",
      });
    }

    // Reset progress
    progress.lecturesProgress = [];
    progress.completed = false;
    progress.completionDate = null;

    await progress.save();

    res.status(200).json({
      success: true,
      message: "Course progress has been reset",
      data: progress,
    });
  } catch (error) {
    console.error("Error resetting course progress:", error);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};