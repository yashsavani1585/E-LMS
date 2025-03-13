import Course from "../../models/Course.js";

export const addNewCourse = async (req, res) => {
    try {
        const courseData = req.body;
        const newlyCreatedCourse = new Course(courseData)
        const saveCourse = await newlyCreatedCourse.save();

        if (saveCourse) {
            res.status(201).json({
                success: true,
                message: "Course created successfully",
                data: saveCourse
            })
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            message: "Failed to create course"
        })
    }
};

export const getAllCourses = async (req, res) => {
    try {
        const coursesList = await Course.find({});
        res.status(200).json({
            success: true,
            message: "All courses retrieved successfully",
            data: coursesList
        })
    } catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            message: "Failed to get all courses"
        })
    }
}

export const getCourseDetailsByID = async (req, res) => {
    try {
        const { id } = req.params;
        const courseDetails = await Course.findById(id);
        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            })
        }
        res.status(200).json({
            success: true,
            message: "Course details retrieved successfully",
            data: courseDetails
        })
    } catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            message: "Failed to get course details"
        })
    }
};

export const updateCourseByID = async (req, res) => {
    try {

        const { id } = req.params;
        const updatedCourseData = req.body;
        const updatedCourse = await Course.findByIdAndUpdate(id, updatedCourseData, { new: true });

        if (!updatedCourse) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            })
        }

        res.status(200).json({
            success: true,
            message: "Course updated successfully",
            data: updatedCourse
        })
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Failed to update course"
        })
    }
}