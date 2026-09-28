import { School, TvMinimalPlay, Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useContext, useState } from "react";
import { AuthContext } from "@/context/auth-context";

function StudentViewCommonHeader() {
  const navigate = useNavigate();
  const { resetCredentials } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  function handleLogout() {
    resetCredentials();
    sessionStorage.clear();
    navigate("/login"); 
  }

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md border-b z-50">
      <div className="flex items-center justify-between p-4">
       
        <div className="flex items-center space-x-4">
          <Link to="/home" className="flex items-center hover:text-black">
            <School className="h-7 w-7 md:h-8 md:w-8 mr-2 md:mr-4 text-blue-600" />
            <span className="font-extrabold text-[14px] md:text-xl">
              BRAINBOOST
            </span>
          </Link>

          
          <div className="hidden md:flex">
            <Button
              variant="ghost"
              onClick={() => {
                location.pathname.includes("/courses")
                  ? null
                  : navigate("/courses");
              }}
              className="text-[14px] md:text-[16px] font-medium"
            >
              Explore Courses
            </Button>
          </div>
        </div>

       
        <div className="hidden md:flex items-center space-x-4">
          <div
            onClick={() => navigate("/student-courses")}
            className="flex cursor-pointer items-center gap-2 md:gap-3"
          >
            <span className="font-extrabold text-[14px] md:text-xl">
              My Courses
            </span>
            <TvMinimalPlay className="w-7 h-7 md:w-8 md:h-8 cursor-pointer" />
          </div>
          <Button
            onClick={handleLogout}
            className="text-[12px] px-3 py-2 md:px-4 md:py-2"
          >
            Sign Out
          </Button>
        </div>

        
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      
      {isOpen && (
        <div className="md:hidden bg-white shadow-md absolute top-full left-0 w-full p-4 space-y-3">
          
          <button
            onClick={() => {
              navigate("/courses");
              setIsOpen(false); 
            }}
            className="block w-full text-left text-sm font-medium hover:bg-gray-100 p-2 rounded"
          >
            Explore Courses
          </button>

          
          <button
            onClick={() => {
              navigate("/student-courses");
              setIsOpen(false); 
            }}
            className="block w-full text-left text-sm font-medium hover:bg-gray-100 p-2 rounded"
          >
            My Courses
          </button>


          <Button
            onClick={() => {
              handleLogout();
              setIsOpen(false); 
            }}
            className="w-full text-sm font-medium"
          >
            Sign Out
          </Button>
        </div>
      )}
    </header>
  );
}

export default StudentViewCommonHeader;
