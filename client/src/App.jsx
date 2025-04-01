// import { Route, Routes } from "react-router-dom";
// import AuthPage from "./Pages/auth";
// import RouteGuard from "./components/route-guard";
// import { useContext } from "react";
// import { AuthContext } from "./context/auth-context";
// import InstructorDashboardPage from "./Pages/instructor";
// import StudentViewCommonLayout from "./components/student-view/common-layout";
// import StudentHomePage from "./Pages/student/home";
// import NotFoundPage from "./Pages/not-found";
// import AddNewCoursePage from "./Pages/instructor/add-new-course";
// import StudentViewCoursesPage from "./Pages/student/courses";
// import StudentViewCourseDetailsPage from "./Pages/student/course-details";
// import StudentViewCourseProgressPage from "./Pages/student/course-progress";

// export default function App() {
//   const { auth } = useContext(AuthContext);

//   return (
//     <Routes>
//       {/* Authentication Page */}
//       <Route
//         path="/auth"
//         element={
//           <RouteGuard
//             element={<AuthPage />}
//             authenticated={auth?.authenticate}
//             user={auth?.user}
//           />
//         }
//       />

//       {/* Instructor Routes */}
//       <Route
//         path="/instructor"
//         element={
//           <RouteGuard
//             element={<InstructorDashboardPage />}
//             authenticated={auth?.authenticate}
//             user={auth?.user}
//           />
//         }
//       />
//       <Route
//         path="/instructor/create-new-course"
//         element={
//           <RouteGuard
//             element={<AddNewCoursePage />}
//             authenticated={auth?.authenticate}
//             user={auth?.user}
//           />
//         }
//       />
//       <Route
//         path="/instructor/edit-course/:courseId"
//         element={
//           <RouteGuard
//             element={<AddNewCoursePage />}
//             authenticated={auth?.authenticate}
//             user={auth?.user}
//           />
//         }
//       />

//       {/* Student View Routes */}
//       <Route
//         path="/"
//         element={
//           <RouteGuard
//             element={<StudentViewCommonLayout />}
//             authenticated={auth?.authenticate}
//             user={auth?.user}
//           />
//         }
//       >
//         <Route index element={<StudentHomePage />} />
//         <Route path="" element={<StudentHomePage />} />

//         <Route path="home" element={<StudentHomePage />} />

//         <Route  path="courses" element={<StudentViewCoursesPage />} />

//         <Route  path="course/details/:id" element={<StudentViewCourseDetailsPage />} />

//         <Route path="/student/course/get/details/:id" element={<StudentViewCourseDetailsPage />} />


//         <Route
//           path="course-progress/:id"
//           element={<StudentViewCourseProgressPage />}
//         />



//       </Route>

//       {/* 404 Not Found Page */}
//       <Route path="*" element={<NotFoundPage />} />
//     </Routes>
//   );
// }

import { Route, Routes } from "react-router-dom";
import AuthPage from "./Pages/auth";
import RouteGuard from "./components/route-guard";
import { useContext } from "react";
import { Toaster } from "sonner";
import { AuthContext } from "./context/auth-context";
import InstructorDashboardPage from "./Pages/instructor";
import StudentViewCommonLayout from "./components/student-view/common-layout";
import StudentHomePage from "./Pages/student/home";
import NotFoundPage from "./Pages/not-found";
import AddNewCoursePage from "./Pages/instructor/add-new-course";
import StudentViewCoursesPage from "./Pages/student/courses";
import StudentViewCourseDetailsPage from "./Pages/student/course-details";
import StudentViewCourseProgressPage from "./Pages/student/course-progress";
import StudentCoursesPage from "./Pages/student/student-courses";
import PaymentSuccessPage from "./Pages/student/payment-return";
import AboutUsPage from "./components/student-view/AboutUsPage";
import ContactUsPage from "./components/student-view/ContactUsPage";

export default function App() {
  const { auth } = useContext(AuthContext);

  return (
    <>
    <Toaster position="top-center" richColors />
    <Routes>

      {/* Authentication Page */}
      <Route
        path="/auth"
        element={
          <RouteGuard
            element={<AuthPage />}
            authenticated={auth?.authenticate}
            user={auth?.user}
          />
        }
      />
       <Route path="/about" element={<AboutUsPage />} />
       <Route path="/contact" element={<ContactUsPage />} />

      {/* Instructor Routes */}
      <Route
        path="/instructor"
        element={
          <RouteGuard
            element={<InstructorDashboardPage />}
            authenticated={auth?.authenticate}
            user={auth?.user}
          />
        }
      />
      <Route
        path="/instructor/create-new-course"
        element={
          <RouteGuard
            element={<AddNewCoursePage />}
            authenticated={auth?.authenticate}
            user={auth?.user}
          />
        }
      />
      <Route
        path="/instructor/edit-course/:courseId"
        element={
          <RouteGuard
            element={<AddNewCoursePage />}
            authenticated={auth?.authenticate}
            user={auth?.user}
          />
        }
      />

      {/* Student View Routes */}
      <Route
        path="/"
        element={
          <RouteGuard
            element={<StudentViewCommonLayout />}
            authenticated={auth?.authenticate}
            user={auth?.user}
          />
        }
      >
        <Route index element={<StudentHomePage />} />
        <Route path="" element={<StudentHomePage />} />
        <Route path="home" element={<StudentHomePage />} />
        <Route path="courses" element={<StudentViewCoursesPage />} />
        <Route path="course/details/:id" element={<StudentViewCourseDetailsPage />} />
        <Route path="payment-success" element={<PaymentSuccessPage />} />
        <Route path="student-courses" element={<StudentCoursesPage />} />
        <Route path="course-progress/:id" element={<StudentViewCourseProgressPage />} />
      </Route>

      {/* 404 Not Found Page */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
    </>
  );
}