import { Outlet, useLocation } from "react-router-dom";
import StudentViewCommonHeader from "./header";
import StudentViewCommonFooter from "./footer";

function StudentViewCommonLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Conditionally render header */}
      {!location.pathname.includes("course-progress") && <StudentViewCommonHeader />}

      {/* Main content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      {!location.pathname.includes("course-progress") && <StudentViewCommonFooter />}
    </div>
  );
}

export default StudentViewCommonLayout;