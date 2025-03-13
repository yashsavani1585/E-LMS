import InstructorCourses from "@/components/instructor-view/courses";
import InstructorDashboard from "@/components/instructor-view/dashboard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { AuthContext } from "@/context/auth-context";
import { InstructorContext } from "@/context/instructor-context";
import { fetchInstructorCourseListService } from "@/service";
import { BarChart, Book, LogOut } from "lucide-react";
import { useContext, useState, useEffect } from "react";

function InstructorDashboardpage() {
    const [activeTab, setActiveTab] = useState("dashboard");
    const { resetCredentials } = useContext(AuthContext);
    const { instructorCoursesList,setInstructorCoursesList } = useContext(InstructorContext);

    async function fetchAllCourses() {
        const response = await fetchInstructorCourseListService();
        if (response?.success) setInstructorCoursesList(response?.data);
      }
    
      useEffect(() => {
        fetchAllCourses();
      }, []);

    function handleLogout() {
        resetCredentials();
        sessionStorage.clear();
    }

    const menuItems = [
        {
            icon: BarChart,
            label: "Dashboard",
            value: "dashboard",
            Component: <InstructorDashboard listOfCourses={instructorCoursesList}/>
        },
        {
            icon: Book,
            label: "Courses",
            value: "courses",
            Component: <InstructorCourses listOfCourses={instructorCoursesList} />
        },
        {
            icon: LogOut,
            label: "Logout",
            value: "logout",
            Component: null
        }
    ];

    return (
        <div className="flex h-full min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md hidden md:block">
                <div className="p-4">
                    <h2 className="text-2xl font-bold mb-4">Instructor View</h2>
                    <nav>
                        {menuItems.map((item) => (
                            <Button
                                key={item.value}
                                className="w-full justify-start mb-2"
                                variant={activeTab === item.value ? "secondary" : "ghost"}
                                onClick={item.value === "logout" ? handleLogout : () => setActiveTab(item.value)}
                            >
                                <item.icon className="w-4 h-4 mr-2" />
                                {item.label}
                            </Button>
                        ))}
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        {menuItems.map((item) => (
                            <TabsContent key={item.value} value={item.value}>
                                {item.Component !== null ? item.Component : null}
                            </TabsContent>
                        ))}
                    </Tabs>
                </div>
            </main>
        </div>
    );
}

export default InstructorDashboardpage;
