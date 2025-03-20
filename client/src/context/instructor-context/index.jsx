import { createContext, useState } from "react";
import { courseCurriculumInitialFormData, courseLandingInitialFormData } from "@/config";

export const InstructorContext = createContext(null);

export function InstructorProvider({ children }) {
  const [courseLandingFormData, setCourseLandingFormData] = useState(courseLandingInitialFormData);
  const [courseCurriculumFormData, setCourseCurriculumFormData] = useState(courseCurriculumInitialFormData);
  const [mediaUploadProgress, setMediaUploadProgress] = useState(false);
  const [mediaUploadProgressPercentage, setMediaUploadProgressPercentage] = useState(0);
  const [instructorCoursesList, setInstructorCoursesList] = useState([]);
  const [currentEditedCourseId, setCurrentEditedCourseId] = useState(null);

  // Context Value
  const contextValue = {
    courseLandingFormData,
    setCourseLandingFormData,
    courseCurriculumFormData,
    setCourseCurriculumFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
    instructorCoursesList,
    setInstructorCoursesList,
    currentEditedCourseId,
    setCurrentEditedCourseId,
  };

  return (
    <InstructorContext.Provider value={contextValue}>
      {children}
    </InstructorContext.Provider>
  );
}