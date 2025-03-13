// import mongoose from "mongoose";

// const StudentCoursesSchema = new mongoose.Schema({
//     userId: String,
//     courses: [
//       {
//         courseId: String,
//         title: String,
//         instructorId: String,
//         instructorName: String,
//         dateOfPurchase: Date,
//         courseImage: String,
//       },
//     ],
//   });

// const StudentCourses = mongoose.model("StudentCourses", StudentCoursesSchema);

// export default StudentCourses;

// import mongoose from "mongoose";

// const StudentCoursesSchema = new mongoose.Schema({
//     studentId: { type: String, required: true },
//     courseId: { type: String, required: true },
//     enrolledDate: { type: Date, default: Date.now },
//     progress: { type: Number, default: 0 },
//     completed: { type: Boolean, default: false },
// }, { timestamps: true });

// // Prevent Mongoose model overwrite error
// const StudentCourses = mongoose.models.StudentCourses || mongoose.model("StudentCourses", StudentCoursesSchema);

// export default StudentCourses;

import mongoose from "mongoose";

const StudentCoursesSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    courses: [
      {
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
        title: { type: String, required: true },
        instructorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        instructorName: { type: String, required: true },
        dateOfPurchase: { type: Date, default: Date.now },
        courseImage: { type: String },
      },
    ],
    courseCount: { type: Number, default: 0 }, // 🆕 Course count field
  },
  { timestamps: true }
);

// Automatically update course count
StudentCoursesSchema.pre("save", function (next) {
  this.courseCount = this.courses.length;
  next();
});

const StudentCourses = mongoose.model("StudentCourses", StudentCoursesSchema);
export default StudentCourses;
