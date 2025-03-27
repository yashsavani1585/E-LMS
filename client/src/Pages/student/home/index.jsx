import { courseCategories } from "@/config";
import banner from "../../../../assets/banner-img.png";
import { Button } from "@/components/ui/button";
import { StudentContext } from "@/context/student-context";
import { useContext, useEffect } from "react";
import { AuthContext } from "@/context/auth-context";
import { checkCoursePurchaseInfoService, fetchStudentViewCourseListService } from "@/service";
import { useNavigate } from "react-router-dom";
function StudentHomePage() {
    const { studentViewCoursesList, setStudentViewCoursesList } = useContext(StudentContext);
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();

    function handleNavigateToCoursesPage(getCurrentId) {
        console.log(getCurrentId);
        sessionStorage.removeItem("filters");
        const currentFilter = {
            category: [getCurrentId],
        };

        sessionStorage.setItem("filters", JSON.stringify(currentFilter));

        navigate("/courses");
    }

    async function fetchAllStudentViewCourses() {
        const response = await fetchStudentViewCourseListService(auth?.token);

        if (response?.success) setStudentViewCoursesList(response?.data);
        console.log(response);
    }

    async function handleCourseNavigate(getCurrentCourseId) {
        const response = await checkCoursePurchaseInfoService(
            getCurrentCourseId,
            auth?.user?._id
        );

        if (response?.success) {
            if (response?.data) {
                navigate(`/course-progress/${getCurrentCourseId}`);
            } else {
                navigate(`/course/details/${getCurrentCourseId}`);
            }
        }
    }

    useEffect(() => {
        fetchAllStudentViewCourses()
    }, [])
    return (
        <div className="min-h-screen py-24 px-13 bg-white">
            <section className="flex flex-col lg:flex-row items-center justify-between py-8 px-4 lg:px-8">
                <div className="lg:w-1/2 lg:pr-12">
                    <h1 className="text-4xl font-bold mb-4">Learning that gets you</h1>
                    <p className="text-2xl text-gray-600">
                        Discover courses that match your learning style and goals.
                    </p>
                </div>
                <div className="lg:w-full mb-8 py-9 lg:mb-0">
                    <img
                        src={banner}
                        width={600}
                        height={400}
                        className="w-full h-auto rounded-lg shadow-lg"
                    />
                </div>
            </section>
            <section className="py-8 px-4 lg:px-8 bg-gray-100">
                <h2 className="text-2xl font-bold mb-6">Course Categories</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {
                        courseCategories.map((categoryItem) => (
                            <Button
                                className="justify-start border-gray-500 text-gray-700 hover:border-blue-600 hover:bg-blue-100 transition-all duration-300 ease-in-out"
                                key={categoryItem.id}
                                variant="outline"
                                onClick={() => handleNavigateToCoursesPage(categoryItem.id)}
                            >
                                {categoryItem.label}
                            </Button>
                        ))
                    }
                </div>
            </section>
            <section className="py-12 px-4 lg:px-8">
                <h2 className="text-2xl font-bold mb-6">Featured Courses</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
                        studentViewCoursesList.map((courseItem) => (
                            <div
                                key={courseItem?._id} 
                                onClick={() => handleCourseNavigate(courseItem?._id)}
                                className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition duration-300 cursor-pointer"
                            >
                                <img
                                    src={courseItem?.image}
                                    width={300}
                                    height={150}
                                    className="w-full h-40 object-cover"
                                    alt={courseItem?.title}
                                />
                                <div className="p-4">
                                    <h3 className="font-bold mb-2 text-lg">{courseItem?.title}</h3>
                                    <p className="text-sm text-gray-600 mb-2">{courseItem?.instructorName}</p>
                                    <p className="font-bold text-[18px] text-blue-600">₹{courseItem?.pricing}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center">No courses available</p>
                    )}

                </div>
            </section>
        </div>
    );
}

export default StudentHomePage;



