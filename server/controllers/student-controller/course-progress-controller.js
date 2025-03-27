import mongoose from "mongoose";
import CourseProgress from "../../models/CourseProgress.js";
import Course from "../../models/Course.js";
import StudentCourses from "../../models/StudentCourses.js";

// Mark a lecture as viewed
export const markCurrentLectureAsViewed = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { userId, courseId, lectureId } = req.body;

    // Validate inputs
    if (!userId || !courseId || !lectureId) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Validate ObjectIds
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(courseId) ||
      !mongoose.Types.ObjectId.isValid(lectureId)
    ) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Invalid ID format",
      });
    }

    // Check if user has purchased the course
    const studentCourse = await StudentCourses.findOne({ userId }).session(session);
    if (!studentCourse || !studentCourse.courses.some(c => c.courseId.toString() === courseId)) {
      await session.abortTransaction();
      return res.status(403).json({
        success: false,
        message: "Course not purchased by user",
      });
    }

    // Verify lecture exists in course
    const course = await Course.findById(courseId).session(session);
    if (!course) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const lectureExists = course.curriculum.some(
      lecture => lecture._id.toString() === lectureId
    );
    
    if (!lectureExists) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Lecture not found in course curriculum",
      });
    }

    // Find or create progress
    let progress = await CourseProgress.findOne({ userId, courseId }).session(session);
    
    if (!progress) {
      progress = new CourseProgress({
        userId,
        courseId,
        lecturesProgress: [{
          lectureId,
          viewed: true,
          dateViewed: new Date(),
        }],
      });
    } else {
      const existingLecture = progress.lecturesProgress.find(
        lp => lp.lectureId.toString() === lectureId
      );

      if (existingLecture) {
        existingLecture.viewed = true;
        existingLecture.dateViewed = new Date();
      } else {
        progress.lecturesProgress.push({
          lectureId,
          viewed: true,
          dateViewed: new Date(),
        });
      }
    }

    // Check if all lectures are viewed
    const totalLectures = course.curriculum.length;
    const viewedLectures = progress.lecturesProgress.filter(lp => lp.viewed).length;
    
    if (viewedLectures === totalLectures) {
      progress.completed = true;
      progress.completionDate = new Date();
    }

    await progress.save({ session });
    await session.commitTransaction();

    res.status(200).json({
      success: true,
      data: progress,
      message: "Lecture marked as viewed",
    });

  } catch (error) {
    await session.abortTransaction();
    console.error("Error in markCurrentLectureAsViewed:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  } finally {
    session.endSession();
  }
};

// Get current course progress
export const getCurrentCourseProgress = async (req, res) => {
  try {
    const { userId, courseId } = req.params;

    // Validate inputs
    if (!userId || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Missing user ID or course ID",
      });
    }

    // Validate ObjectIds
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(courseId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format",
      });
    }

    // Check course purchase status
    const studentCourse = await StudentCourses.findOne({ userId });
    const isPurchased = studentCourse?.courses.some(c => c.courseId.toString() === courseId) || false;

    if (!isPurchased) {
      return res.status(200).json({
        success: true,
        data: { isPurchased: false },
        message: "Course not purchased",
      });
    }

    // Get course details
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Get progress
    const progress = await CourseProgress.findOne({ userId, courseId });

    res.status(200).json({
      success: true,
      data: {
        courseDetails: course,
        progress: progress?.lecturesProgress || [],
        completed: progress?.completed || false,
        completionDate: progress?.completionDate || null,
        isPurchased: true,
      },
    });

  } catch (error) {
    console.error("Error in getCurrentCourseProgress:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// Reset course progress
export const resetCurrentCourseProgress = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { userId, courseId } = req.body;

    // Validate inputs
    if (!userId || !courseId) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Missing user ID or course ID",
      });
    }

    // Validate ObjectIds
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(courseId)
    ) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Invalid ID format",
      });
    }

    // Check if progress exists
    const progress = await CourseProgress.findOne({ userId, courseId }).session(session);
    if (!progress) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Progress not found",
      });
    }

    // Reset progress
    progress.lecturesProgress = [];
    progress.completed = false;
    progress.completionDate = null;

    await progress.save({ session });
    await session.commitTransaction();

    res.status(200).json({
      success: true,
      data: progress,
      message: "Progress reset successfully",
    });

  } catch (error) {
    await session.abortTransaction();
    console.error("Error in resetCurrentCourseProgress:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  } finally {
    session.endSession();
  }
};
