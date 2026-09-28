

import mongoose from "mongoose";

const LectureProgressSchema = new mongoose.Schema({
  lectureId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true 
  },
  viewed: { 
    type: Boolean, 
    default: false 
  },
  dateViewed: { 
    type: Date 
  },
});

const CourseProgressSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  courseId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Course", 
    required: true 
  },
  completed: { 
    type: Boolean, 
    default: false 
  },
  completionDate: { 
    type: Date 
  },
  lecturesProgress: [LectureProgressSchema],
}, { 
  timestamps: true 
});

const CourseProgress = mongoose.model("CourseProgress", CourseProgressSchema);
export default CourseProgress;
