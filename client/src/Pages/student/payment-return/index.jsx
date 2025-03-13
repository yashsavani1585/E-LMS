import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { captureAndFinalizePaymentService } from "@/service";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState(null);

  const paymentId = searchParams.get("paymentId");
  const orderId = searchParams.get("orderId");
  const razorpaySignature = searchParams.get("razorpay_signature");

  console.log("✅ Extracted Payment Details:", { paymentId, orderId, razorpaySignature });

  useEffect(() => {
    if (!paymentId || !orderId || !razorpaySignature) {
      console.error("❌ Missing payment details.");
      navigate("/payment-failed");
      return;
    }

    const processPayment = async () => {
      try {
        // Step 1: Capture and finalize payment
        const paymentResponse = await captureAndFinalizePaymentService(orderId, paymentId, razorpaySignature);
        if (!paymentResponse?.success) {
          console.error("❌ Payment capture failed:", paymentResponse);
          navigate("/payment-failed");
          return;
        }

        // Step 2: Use the data from paymentResponse directly
        const { courseTitle, coursePricing, orderId: responseOrderId } = paymentResponse.data;

        // Step 3: Update state with order details
        setOrderDetails({
          courseTitle,
          coursePricing,
          orderId: responseOrderId,
        });

        sessionStorage.removeItem("currentOrderId"); // Clear session storage
      } catch (error) {
        console.error("❌ Error processing payment:", error);
        navigate("/payment-failed");
      } finally {
        setLoading(false);
      }
    };

    processPayment();
  }, [paymentId, orderId, razorpaySignature, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="p-6 shadow-lg">
          <CardHeader>
            <CardTitle>Processing Payment... Please Wait</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!orderDetails) {
    return null; // or redirect to an error page
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful!</h1>
        <p className="text-lg mb-4">Thank you for your purchase.</p>
        <div className="text-left">
          <p><strong>Course:</strong> {orderDetails.courseTitle}</p>
          <p><strong>Amount:</strong> ₹{orderDetails.coursePricing}</p>
          <p><strong>Order ID:</strong> {orderDetails.orderId}</p>
        </div>
        <button
          onClick={() => navigate("/student-courses")}
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Go to My Courses
        </button>
      </div>
    </div>
  );
}

export default PaymentSuccessPage;