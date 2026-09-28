import { Outlet, useLocation } from "react-router-dom";
import StudentViewCommonHeader from "./header";
import StudentViewCommonFooter from "./footer";

function StudentViewCommonLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">

      {!location.pathname.includes("course-progress") && <StudentViewCommonHeader />}

     
      <main className="flex-grow">
        <Outlet />
      </main>


      {!location.pathname.includes("course-progress") && <StudentViewCommonFooter />}
    </div>
  );
}

export default StudentViewCommonLayout;
