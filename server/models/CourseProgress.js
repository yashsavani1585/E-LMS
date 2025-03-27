// // import mongoose from "mongoose";

// // const LectureProgressSchema = new mongoose.Schema({
// //     lectureId: String,
// //     viewed: Boolean,
// //     dateViewed: Date,
// //   });
  
// //   const CourseProgressSchema = new mongoose.Schema({
// //     userId: String,
// //     courseId: String,
// //     completed: Boolean,
// //     completionDate: Date,
// //     lecturesProgress: [LectureProgressSchema],
// //   });
  

// // const Progress = mongoose.model("Progress", CourseProgressSchema);

// // export default Progress;

//  import mongoose from "mongoose";

// // Lecture Progress Schema
// const LectureProgressSchema = new mongoose.Schema({
//   lectureId: { type: mongoose.Schema.Types.ObjectId, ref: "Lecture", required: true },
//   viewed: { type: Boolean, default: false },
//   dateViewed: { type: Date },
// });

// // Course Progress Schema
// const CourseProgressSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
//   completed: { type: Boolean, default: false },
//   completionDate: { type: Date },
//   lecturesProgress: [LectureProgressSchema],
// }, { timestamps: true });

// const Progress = mongoose.model("Progress", CourseProgressSchema);
// export default Progress;

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