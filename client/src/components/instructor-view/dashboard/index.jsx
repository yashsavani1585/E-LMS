import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users } from "lucide-react";

function InstructorDashboard({ listOfCourses = [] }) {
  // Check if listOfCourses is valid
  if (!Array.isArray(listOfCourses) || listOfCourses.length === 0) {
    return <div className="text-center text-gray-500">No courses available.</div>;
  }

  function calculateTotalStudentsAndProfit() {
    return listOfCourses.reduce(
      (acc, course) => {
        const studentCount = Array.isArray(course.students) ? course.students.length : 0;
        acc.totalStudents += studentCount;
        acc.totalProfit += (course.pricing || 0) * studentCount;

        if (Array.isArray(course.students)) {
          course.students.forEach((student) => {
            acc.studentList.push({
              courseTitle: course.title || "Untitled Course",
              studentName: student.studentName || "Unknown",
              studentEmail: student.studentEmail || "No Email",
            });
          });
        }

        return acc;
      },
      {
        totalStudents: 0,
        totalProfit: 0,
        studentList: [],
      }
    );
  }

  const { totalStudents, totalProfit, studentList } = calculateTotalStudentsAndProfit();

  const config = [
    {
      icon: Users,
      label: "Total Students",
      value: totalStudents,
    },
    {
      icon: () => <span className="text-lg font-bold">₹</span>, // Indian Rupee Symbol
      label: "Total Revenue",
      value: `₹${totalProfit}`,
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {config.map((item, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{item.label}</CardTitle>
              {typeof item.icon === "function" ? item.icon() : <item.icon className="h-4 w-4 text-muted-foreground" />}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Students List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Course Name</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Student Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentList.length > 0 ? (
                  studentList.map((studentItem, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{studentItem.courseTitle}</TableCell>
                      <TableCell>{studentItem.studentName}</TableCell>
                      <TableCell>{studentItem.studentEmail}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan="3" className="text-center text-gray-500">
                      No students enrolled yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default InstructorDashboard;
