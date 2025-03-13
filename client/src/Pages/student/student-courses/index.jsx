import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import { fetchStudentBoughtCoursesService } from "@/service";
import { Watch, XCircle } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function StudentCoursesPage() {
  const { auth } = useContext(AuthContext);
  const { studentBoughtCoursesList, setStudentBoughtCoursesList } = useContext(StudentContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  async function fetchStudentBoughtCourses() {
    try {
      setLoading(true);
      const response = await fetchStudentBoughtCoursesService(auth?.user?._id);

      if (response?.success) {
        setStudentBoughtCoursesList(response?.data);
      } else {
        console.error("❌ Failed to fetch courses:", response);
      }
    } catch (error) {
      console.error("❌ Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStudentBoughtCourses();
  }, []);

  return (
    <div className="py-24 px-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Courses</h1>
        <Button variant="ghost" onClick={() => navigate("/")}>
          <XCircle className="h-6 w-6 mr-2" /> Close
        </Button>
      </div>

      {loading ? (
        <p className="text-lg">Loading your courses...</p>
      ) : studentBoughtCoursesList?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {studentBoughtCoursesList.map((course) => (
            <Card key={course.courseId} className="flex flex-col">
              <CardContent className="p-4 flex-grow">
                <img
                  src={course?.courseImage || "/default-course.jpg"}
                  alt={course?.title}
                  className="h-52 w-full object-cover rounded-md mb-4"
                />
                <h3 className="font-bold mb-1">{course?.title}</h3>
                <p className="text-sm text-gray-700 mb-2">{course?.instructorName}</p>
              </CardContent>
              <CardFooter>
                <Button onClick={() => navigate(`/course-progress/${course?.courseId}`)} className="flex-1">
                  <Watch className="mr-2 h-4 w-4" />
                  Start Watching
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <h1 className="text-3xl font-bold">No Courses Found</h1>
      )}
    </div>
  );
}

export default StudentCoursesPage;
