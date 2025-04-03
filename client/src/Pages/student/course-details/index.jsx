
import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Skeleton from "@/components/ui/skeleton";
import VideoPlayer from "@/components/video-player";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import { captureAndFinalizePaymentService, checkCoursePurchaseInfoService, createPaymentService, fetchStudentViewCourseDetailsService } from "@/service";
import { CheckCircle, Globe, Lock, PlayCircle } from "lucide-react";

function StudentViewCourseDetailsPage() {
  const {
    studentViewCourseDetails,
    setStudentViewCourseDetails,
    currentCourseDetailsId,
    setCurrentCourseDetailsId,
    loadingState,
    setLoadingState,
  } = useContext(StudentContext);

  const { auth } = useContext(AuthContext);
  const [displayCurrentVideoFreePreview, setDisplayCurrentVideoFreePreview] = useState(null);
  const [showFreePreviewDialog, setShowFreePreviewDialog] = useState(false);
  const [error, setError] = useState(null);
  const [hasPurchased, setHasPurchased] = useState(false); // Track purchase status
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  // Fetch course details and check purchase status
  useEffect(() => {
    if (id) {
      setCurrentCourseDetailsId(id);
      fetchStudentViewCourseDetails(id);
      checkIfUserHasPurchasedCourse(id); // Check if the user has already purchased the course
    }
  }, [id]);

  // Fetch course details
  async function fetchStudentViewCourseDetails(courseId) {
    if (!courseId) {
      console.error("Course ID is missing");
      return;
    }

    setLoadingState(true);
    try {
      const response = await fetchStudentViewCourseDetailsService(courseId);
      if (response?.success) {
        setStudentViewCourseDetails(response?.data);
      } else {
        setStudentViewCourseDetails(null);
      }
    } catch (error) {
      console.error("Error fetching course details:", error);
      setStudentViewCourseDetails(null);
    } finally {
      setLoadingState(false);
    }
  }

  // Check if the user has already purchased the course
  async function checkIfUserHasPurchasedCourse(courseId) {
    if (!auth?.user?._id || !courseId) return;

    try {
      const response = await checkCoursePurchaseInfoService(courseId, auth.user._id);
      if (response?.success && response?.hasPurchased) {
        setHasPurchased(true); // User has already purchased the course
      } else {
        setHasPurchased(false); // User has not purchased the course
      }
    } catch (error) {
      console.error("Error checking purchase status:", error);
      setHasPurchased(false);
    }
  }

  // Redirect to /student-courses if the user has already purchased the course
  useEffect(() => {
    if (hasPurchased) {
      navigate("/student-courses");
    }
  }, [hasPurchased, navigate]);

  // Handle payment creation
  async function handleCreatePayment() {
    setError(null);

    if (!window.Razorpay) {
      console.error("Razorpay SDK not loaded");
      setError("Payment service is currently unavailable. Please try again later.");
      return;
    }

    try {
      const paymentPayload = {
        userId: auth?.user?._id,
        userName: auth?.user?.userName,
        userEmail: auth?.user?.userEmail,
        paymentMethod: "razorpay",
        paymentStatus: "initiated",
        orderDate: new Date(),
        instructorId: studentViewCourseDetails?.instructorId,
        instructorName: studentViewCourseDetails?.instructorName,
        courseImage: studentViewCourseDetails?.courseImage,
        courseTitle: studentViewCourseDetails?.title,
        courseId: studentViewCourseDetails?._id,
        coursePricing: studentViewCourseDetails?.pricing,
        currency: "INR",
      };

      const response = await createPaymentService(paymentPayload);
      if (response.success) {
        sessionStorage.setItem("currentOrderId", JSON.stringify(response?.data?.orderId));

        const options = {
          // key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          key : "rzp_test_z8VHG8l7lxwyLF",
          amount: response.data.amount,
          currency: "INR",
          name: "BRAINBOOST",
          description: "Course Payment",
          order_id: response.data.orderId,
          handler: async function (response) {
            try {
              const captureResponse = await captureAndFinalizePaymentService(
                response.razorpay_order_id,
                response.razorpay_payment_id,
                response.razorpay_signature
              );

              if (captureResponse.success) {
                navigate(`/payment-success?paymentId=${response.razorpay_payment_id}&orderId=${response.razorpay_order_id}&razorpay_signature=${response.razorpay_signature}`);
              } else {
                setError("Payment capture failed. Please contact support.");
              }
            } catch (error) {
              console.error("Error capturing payment:", error);
              setError("An error occurred while processing your payment. Please try again.");
            }
          },
          prefill: {
            name: auth?.user?.userName,
            email: auth?.user?.userEmail,
          },
          theme: {
            color: "#37474F",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        setError(response.message || "Failed to create payment.");
      }
    } catch (error) {
      console.error("Payment Error:", error);
      setError("An error occurred while processing your payment. Please try again.");
    }
  }

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      console.log("Razorpay script loaded successfully.");
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Show free preview dialog
  useEffect(() => {
    if (displayCurrentVideoFreePreview !== null) setShowFreePreviewDialog(true);
  }, [displayCurrentVideoFreePreview]);

  // Reset state when navigating away
  useEffect(() => {
    if (!location.pathname.includes("course/details")) {
      setStudentViewCourseDetails(null);
      setCurrentCourseDetailsId(null);
    }
  }, [location.pathname]);

  if (loadingState) return <Skeleton />;

  if (!studentViewCourseDetails) {
    return <div>No course details available.</div>;
  }

  const getIndexOfFreePreviewUrl =
    studentViewCourseDetails?.curriculum?.findIndex((item) => item.freePreview) ?? -1;

  return (
    <div className="mx-auto py-24 px-12 md:px-12 max-w-7xl">
      {!hasPurchased && ( // Only show course details if the user hasn't purchased the course
        <>
          <div className="bg-gray-900 text-white p-6 md:p-8 rounded-t-lg">
            <h1 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">
              {studentViewCourseDetails?.title || "Course Title Not Available"}
            </h1>
            <p className="text-lg md:text-xl mb-3">{studentViewCourseDetails?.subtitle}</p>
            <div className="flex flex-wrap items-center gap-2 md:gap-4 text-sm md:text-base">
              <span>Created By : {studentViewCourseDetails?.instructorName}</span>
              <span>Created On : {studentViewCourseDetails?.date.split("T")[0]}</span>
              <span className="flex items-center">
                <Globe className="mr-1 h-4 w-4" />
                {studentViewCourseDetails?.primaryLanguage}
              </span>
              <span>
                {studentViewCourseDetails?.students.length}{" "}
                {studentViewCourseDetails?.students.length <= 1 ? "Student" : "Students"}
              </span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 md:gap-8 mt-6">
            <main className="flex-grow">
              <Card className="mb-6 md:mb-8">
                <CardHeader>
                  <CardTitle>What you'll learn</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {studentViewCourseDetails?.objectives.split(",").map((objective, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
                        <span>{objective}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="mb-6 md:mb-8">
                <CardHeader>
                  <CardTitle>Course Description</CardTitle>
                </CardHeader>
                <CardContent>{studentViewCourseDetails?.description}</CardContent>
              </Card>

              <Card className="mb-6 md:mb-8">
                <CardHeader>
                  <CardTitle>Course Curriculum</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul>
                    {studentViewCourseDetails?.curriculum?.map((curriculumItem, index) => (
                      <li
                        key={index}
                        className={`${curriculumItem?.freePreview ? "cursor-pointer" : "cursor-not-allowed"
                          } flex items-center mb-3`}
                        onClick={
                          curriculumItem?.freePreview ? () => handleSetFreePreview(curriculumItem) : null
                        }
                      >
                        {curriculumItem?.freePreview ? (
                          <PlayCircle className="mr-2 h-4 w-4" />
                        ) : (
                          <Lock className="mr-2 h-4 w-4" />
                        )}
                        <span>{curriculumItem?.title}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </main>

            <aside className="w-full md:w-[400px] lg:w-[500px]">
              <Card className="sticky top-4">
                <CardContent className="p-6">
                  <div className="aspect-video mb-4 rounded-lg flex items-center justify-center">
                    <VideoPlayer
                      url={
                        getIndexOfFreePreviewUrl !== -1
                          ? studentViewCourseDetails?.curriculum[getIndexOfFreePreviewUrl].videoUrl
                          : ""
                      }
                      width="100%"
                    />
                  </div>
                  <div className="mb-4">
                    <span className="text-2xl md:text-3xl font-bold">
                      ₹{studentViewCourseDetails?.pricing}
                    </span>
                  </div>
                  <Button onClick={handleCreatePayment} className="w-full">
                    ENROLL NOW
                  </Button>
                  {error && <p className="text-red-500 mt-2">{error}</p>}
                </CardContent>
              </Card>
            </aside>
          </div>

          <Dialog
            open={showFreePreviewDialog}
            onOpenChange={() => {
              setShowFreePreviewDialog(false);
              setDisplayCurrentVideoFreePreview(null);
            }}
          >
            <DialogContent className="w-full md:w-[600px] lg:w-[800px]">
              <DialogHeader>
                <DialogTitle>Course Preview</DialogTitle>
              </DialogHeader>
              <div className="aspect-video rounded-lg flex items-center justify-center">
                <VideoPlayer url={displayCurrentVideoFreePreview} width="100%" />
              </div>
              <div className="flex flex-col gap-2">
                {studentViewCourseDetails?.curriculum
                  ?.filter((item) => item.freePreview)
                  .map((filteredItem) => (
                    <p
                      key={filteredItem._id}
                      onClick={() => handleSetFreePreview(filteredItem)}
                      className="cursor-pointer text-[14px] md:text-[16px] font-medium"
                    >
                      {filteredItem?.title}
                    </p>
                  ))}
              </div>
              <DialogFooter className="sm:justify-start">
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Close
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}

export default StudentViewCourseDetailsPage;
