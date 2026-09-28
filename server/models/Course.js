
import mongoose from "mongoose";

const LectureSchema = new mongoose.Schema({
  title: { type: String, required: true },
  videoUrl: { type: String, required: true },
  public_id: { type: String, required: true },
  freePreview: { type: Boolean, default: false },
});

const CourseSchema = new mongoose.Schema(
  {
    instructorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    instructorName: { type: String, required: true },
    date: { type: Date, default: Date.now },
    title: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    level: { type: String, required: true },
    primaryLanguage: { type: String, required: true },
    subtitle: { type: String },
    description: { type: String, required: true },
    image: { type: String, required: true },
    welcomeMessage: { type: String },
    pricing: { type: Number, required: true },
    objectives: { type: String },
    students: [
      {
        studentId: String,
        studentName: String,
        studentEmail: String,
        paidAmount: Number,
      },
    ],
    studentCount: { type: Number, default: 0 }, 
    curriculum: [LectureSchema],
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);


CourseSchema.pre("save", function (next) {
  this.studentCount = this.students.length;
  next();
});

const Course = mongoose.model("Course", CourseSchema);
export default Course;
