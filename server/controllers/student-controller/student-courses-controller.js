import StudentCourses from "../../models/StudentCourses.js";

export const getCoursesByStudentId = async (req, res) => {
    try {
        const { studentId } = req.params;
        const studentBoughtCourses = await StudentCourses.findOne({ userId: studentId });

        if (!studentBoughtCourses) {
            return res.status(404).json({
                success: false,
                message: "No courses found for this student",
            });
        }

        res.status(200).json({
            success: true,
            data: studentBoughtCourses.courses,
            message: "Courses purchased by student fetched successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch courses purchased by student",
        });
    }
};
