import axiosInstance from "@/api/axiosInstance";

export async function registerService(formData) {
  try {
    const { data } = await axiosInstance.post("/auth/register", {
      ...formData,
      role: "user",
    });
    return data;
  } catch (error) {
    console.error("Register API Error:", error.response?.data || error.message);
    throw error;
  }
}

export async function loginService(formData) {
  try {
    const { data } = await axiosInstance.post("/auth/login", formData);
    return data;
  } catch (error) {
    console.error("Login API Error:", error.response?.data || error.message);
    throw error;
  }
}

export async function checkAuthService() {
  const accessToken = sessionStorage.getItem("accessToken");

  if (!accessToken) {
    console.error("No access token found in sessionStorage");
    return { success: false, message: "Unauthorized: No token provided" };
  }

  try {
    const { data } = await axiosInstance.get("/auth/check-auth", {
      headers: {
        Authorization: `Bearer ${JSON.parse(accessToken)}`,
      },
    });

    return data;
  } catch (error) {
    console.error("Auth Check Error:", error.response?.data || error.message);
    return { success: false, message: "Unauthorized: Invalid token" };
  }
}

export async function mediaUploadService(formData, onProgressCallback) {
  const accessToken = sessionStorage.getItem("accessToken");

  if (!accessToken) {
    console.error("No access token found in sessionStorage");
    return { success: false, message: "Unauthorized: No token provided" };
  }

  try {
    const { data } = await axiosInstance.post("/media/upload", formData, {
      headers: {
        Authorization: `Bearer ${JSON.parse(accessToken)}`,
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        if (onProgressCallback) {
          onProgressCallback(percentCompleted);
        }
      },
    });

    return data;
  } catch (error) {
    console.error("Error during media upload:", error.response?.data || error.message);
    return { success: false, message: error.response?.data?.message || "Upload failed" };
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
  const { data } = await axiosInstance.post(
    `/student/course-progress/mark-lecture-viewed`,
    {
      userId,
      courseId,
      lectureId,
    }
  );

  return data;
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