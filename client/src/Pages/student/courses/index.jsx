import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import Skeleton from "@/components/ui/skeleton";
import { filterOptions, sortOptions } from "@/config";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  checkCoursePurchaseInfoService,
  fetchStudentViewCourseListService,
} from "@/service";

import { ArrowUpDownIcon } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function StudentViewCoursesPage() {
  const [sort, setSort] = useState("price-lowtohigh");
  const [filters, setFilters] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    studentViewCoursesList = [],
    setStudentViewCoursesList,
    loadingState,
    setLoadingState,
  } = useContext(StudentContext);
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  function handleFilterOnChange(getSectionId, getCurrentOption) {
    let updatedFilters = { ...filters };
    if (!updatedFilters[getSectionId]) {
      updatedFilters[getSectionId] = [];
    }
    const index = updatedFilters[getSectionId].indexOf(getCurrentOption.id);
    if (index === -1) {
      updatedFilters[getSectionId].push(getCurrentOption.id);
    } else {
      updatedFilters[getSectionId].splice(index, 1);
    }
    setFilters(updatedFilters);
    sessionStorage.setItem("filters", JSON.stringify(updatedFilters));
  }

  async function fetchAllStudentViewCourses(filters, sort) {
    setLoadingState(true);
    const query = new URLSearchParams({ ...filters, sortBy: sort });
    const response = await fetchStudentViewCourseListService(query);
    if (response?.success) {
      setStudentViewCoursesList(response.data);
    }
    setLoadingState(false);
  }

  async function handleCourseNavigate(getCurrentCourseId) {
    if (!getCurrentCourseId) {
      console.error("handleCourseNavigate: Missing course ID");
      return;
    }

    if (!auth?.user?._id) {
      console.error("handleCourseNavigate: Missing user ID");
      return;
    }

    try {
      console.log("Checking purchase info for course:", getCurrentCourseId);
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
      } else {
        console.error("Failed to check course purchase info:", response?.message);
      }
    } catch (error) {
      console.error("Error checking course purchase info:", error);
    }
  }

  useEffect(() => {
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
  }, []);

  useEffect(() => {
    setSearchParams(new URLSearchParams(filters));
  }, [filters, setSearchParams]);

  useEffect(() => {
    fetchAllStudentViewCourses(filters, sort);
  }, [filters, sort]);

  return (
    <div className="container mx-auto py-24 px-12 lg:px-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center md:text-left">
        📚 All Courses
      </h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <aside className="w-full md:w-72 bg-white shadow-lg rounded-lg p-5">
          {Object.keys(filterOptions).map((keyItem) => (
            <div key={keyItem} className="border-b pb-4 last:border-b-0">
              <h3 className="font-semibold text-lg mb-3">
                {keyItem.toUpperCase()}
              </h3>
              <div className="space-y-3">
                {filterOptions[keyItem].map((option) => (
                  <Label key={option.id} className="flex items-center gap-3">
                    <Checkbox
                      checked={filters[keyItem]?.includes(option.id) || false}
                      onCheckedChange={() =>
                        handleFilterOnChange(keyItem, option)
                      }
                    />
                    <span className="text-sm">{option.label}</span>
                  </Label>
                ))}
              </div>
            </div>
          ))}
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 px-4 py-2"
                >
                  <ArrowUpDownIcon className="h-5 w-5" />
                  <span className="text-sm font-medium">Sort By</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem key={sortItem.id} value={sortItem.id}>
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <span className="text-sm font-semibold text-gray-800">
              {studentViewCoursesList.length} Results
            </span>
          </div>

          {/* Courses List */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loadingState ? (
              <Skeleton />
            ) : studentViewCoursesList.length > 0 ? (
              studentViewCoursesList.map((courseItem) => (
                <Card
                  key={courseItem?._id}
                  onClick={() => handleCourseNavigate(courseItem?._id)}
                  className="cursor-pointer transition-transform duration-200 hover:scale-105"
                >
                  <CardContent className="p-4 space-y-3">
                    <img
                      src={courseItem?.image}
                      className="w-full h-40 object-cover rounded-md shadow-sm"
                      alt="Course"
                    />
                    <div>
                      <CardTitle className="text-lg font-semibold line-clamp-2">
                        {courseItem?.title}
                      </CardTitle>
                      <p className="text-sm text-gray-500 line-clamp-1">
                        Created By {courseItem?.instructorName}
                      </p>
                      <p className="font-bold text-lg text-blue-600">
                        ₹{courseItem?.pricing}
                      </p>
                      {courseItem?.isPurchased && (
                        <span className="text-sm text-green-600">✅ Purchased</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <h1 className="font-extrabold text-2xl text-center mt-10">
                🚀 No Courses Found 🚀
              </h1>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default StudentViewCoursesPage;