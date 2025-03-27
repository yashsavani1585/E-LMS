import axiosInstance from "@/api/axiosInstance";

const handleError = (error, context) => {
  console.error(`${context} Error:`, error.response?.data || error.message);
  return {
    success: false,
    message: error.response?.data?.message || "An error occurred",
  };
};

export async function registerService(formData) {
  const { data } = await axiosInstance.post("/auth/register", {
    ...formData,
    role: "user",
  });

  return data;
}

export async function loginService(formData) {
  const { data } = await axiosInstance.post("/auth/login", formData);

  return data;
}

export async function checkAuthService() {
  const { data } = await axiosInstance.get("/auth/check-auth");

  return data;
}

export async function mediaUploadService(formData, onProgressCallback) {
  try {
    const { data } = await axiosInstance.post("/media/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (onProgressCallback) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgressCallback(percentCompleted);
        }
      },
    });
    return data;
  } catch (error) {
    return handleError(error, "Media Upload");
  }
}

export async function mediaDeleteService(id) {
  try {
    const { data } = await axiosInstance.delete(`/media/delete/${id}`);
    return data;
  } catch (error) {
    console.error("Media Delete Error:", error.response?.data || error.message);
    return { success: false, message: "Failed to delete media" };
  }
}

export async function fetchInstructorCourseListService() {
  const { data } = await axiosInstance.get(`/instructor/course/get`);

  return data;
}
export async function addNewCourseService(formData) {
  try {
    const { data } = await axiosInstance.post(`/instructor/course/add`, formData);
    return data;
  } catch (error) {
    console.error("Add Course Error:", error.response?.data || error.message);
    return { success: false, message: "Failed to add course" };
  }
}

export async function fetchInstructorCourseDetailsService(id) {
  try {
    const { data } = await axiosInstance.get(`/instructor/course/get/details/${id}`);
    return data;
  } catch (error) {
    console.error("Fetch Course Details Error:", error.response?.data || error.message);
    return { success: false, message: "Failed to fetch course details" };
  }
}

export async function updateCourseByIdService(id, formData) {
  try {
    const { data } = await axiosInstance.put(`/instructor/course/update/${id}`, formData);
    return data;
  } catch (error) {
    console.error("Update Course Error:", error.response?.data || error.message);
    return { success: false, message: "Failed to update course" };
  }
}

export async function mediaBulkUploadService(formData, onProgressCallback) {
  const { data } = await axiosInstance.post("/media/bulk-upload", formData, {
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      onProgressCallback(percentCompleted);
    },
  });

  return data;
}

export async function fetchStudentViewCourseListService(query) {
  const { data } = await axiosInstance.get(`/student/course/get?${query}`);

  return data;
}


// export async function fetchStudentViewCourseDetailsService(courseId) {
//   if (!courseId) {
//     console.error("fetchStudentViewCourseDetailsService: courseId is undefined");
//     return null;
//   }

//   try {
//     console.log(`Fetching course details for ID: ${courseId}`); // Debugging
//     const { data } = await axiosInstance.get(`/student/course/get/details/${courseId}`);
//     return data;
//   } catch (error) {
//     console.error("Error fetching course details:", error);
//     return null;
//   }
// }

export async function fetchStudentViewCourseDetailsService(courseId) {
  const { data } = await axiosInstance.get(
    `/student/course/get/details/${courseId}`
  );

  return data;
}

// services/checkCoursePurchaseInfoService.js
export async function checkCoursePurchaseInfoService(courseId, studentId) {
  try {
    const { data } = await axiosInstance.get(
      `/student/course/purchase-info/${courseId}/${studentId}`
    );
    return data;
  } catch (error) {
    console.error("❌ Error fetching course purchase info:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch course purchase info",
    };
  }
}

export async function createPaymentService(formData) {
  const { data } = await axiosInstance.post(`/student/order/create`, formData);

  return data;
}

export async function captureAndFinalizePaymentService(orderId, razorpay_payment_id, razorpay_signature) {
  if (!orderId || !razorpay_payment_id || !razorpay_signature) {
    console.error("❌ Missing required payment details");
    return { success: false, message: "Missing required payment details" };
  }

  try {
    const { data } = await axiosInstance.post(`/student/order/capture`, {
      orderId,
      razorpay_payment_id,
      razorpay_signature,
    });
    return data;
  } catch (error) {
    console.error("❌ Error processing payment:", error);
    return { success: false, message: error.response?.data?.message || "Payment processing failed" };
  }
}

export async function fetchStudentBoughtCoursesService(studentId) {
  const { data } = await axiosInstance.get(
    `/student/courses-bought/get/${studentId}`
  );

  return data;
}

export async function getCurrentCourseProgressService(userId, courseId) {
  const { data } = await axiosInstance.get(
    `/student/course-progress/get/${userId}/${courseId}`
  );

  return data;
}


export async function markLectureAsViewedService(userId, courseId, lectureId) {
  try {
    const { data } = await axiosInstance.post(
      `/student/course-progress/mark-lecture-viewed`,
      { userId, courseId, lectureId },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 10 seconds timeout
      }
    );
    return data;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      throw new Error(error.response.data.message || 'Failed to mark lecture as viewed');
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response from server. Please check your connection.');
    } else {
      // Something happened in setting up the request
      throw new Error('Request setup error: ' + error.message);
    }
  }
}

export async function resetCourseProgressService(userId, courseId) {
  const { data } = await axiosInstance.post(
    `/student/course-progress/reset-progress`,
    {
      userId,
      courseId,
    }
  );

  return data;
}