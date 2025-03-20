import CommonForm from "@/components/common-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { signInFormControls, signUpFormControls } from "@/config";
import { AuthContext } from "@/context/auth-context";
import { School } from "lucide-react";
import { useContext, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast"; // Import toast for notifications

function AuthPage() {
  const [activeTab, setActiveTab] = useState("signin");
  const {
    signInFormData,
    setSignInFormData,
    signUpFormData,
    setSignUpFormData,
    handleRegisterUser,
    handleLoginUser,
  } = useContext(AuthContext);

  // Handle tab change
  const handleTabChange = useCallback((value) => {
    setActiveTab(value);
  }, []);

  // Validate Sign-In Form
  const checkIfSignInFormIsValid = useCallback(() => {
    return (
      signInFormData &&
      signInFormData.userEmail.trim() !== "" &&
      signInFormData.password.trim() !== ""
    );
  }, [signInFormData]);

  // Validate Sign-Up Form
  const checkIfSignUpFormIsValid = useCallback(() => {
    return (
      signUpFormData &&
      signUpFormData.userName.trim() !== "" &&
      signUpFormData.userEmail.trim() !== "" &&
      signUpFormData.password.trim() !== ""
    );
  }, [signUpFormData]);

  // Handle Sign-In Submission
  const handleSignIn = useCallback(
    async (event) => {
      event.preventDefault();
      if (!checkIfSignInFormIsValid()) {
        toast.error("Please fill in all fields.");
        return;
      }
      try {
        await handleLoginUser(event);
        toast.success("Logged in successfully!");
      } catch (error) {
        toast.error("Login failed. Please try again.");
      }
    },
    [handleLoginUser, checkIfSignInFormIsValid]
  );

  // Handle Sign-Up Submission
  const handleSignUp = useCallback(
    async (event) => {
      event.preventDefault();
      if (!checkIfSignUpFormIsValid()) {
        toast.error("Please fill in all fields.");
        return;
      }
      try {
        await handleRegisterUser(event);
        toast.success("Account created successfully!");
        setActiveTab("signin"); // Switch to Sign-In tab after successful registration
      } catch (error) {
        toast.error("Registration failed. Please try again.");
      }
    },
    [handleRegisterUser, checkIfSignUpFormIsValid]
  );

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link to={"/"} className="flex items-center justify-center">
          <School className="h-8 w-8 mr-4 text-blue-600" />
          <span className="font-extrabold">BRAINBOOST</span>
        </Link>
      </header>
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Tabs
          value={activeTab}
          defaultValue="signin"
          onValueChange={handleTabChange}
          className="w-full max-w-md"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <Card className="p-6 space-y-4">
              <CardHeader>
                <CardTitle>Sign in to your account</CardTitle>
                <CardDescription>
                  Enter your email and password to access your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <CommonForm
                  formControls={signInFormControls}
                  buttonText={"Sign In"}
                  formData={signInFormData}
                  setFormData={setSignInFormData}
                  isButtonDisabled={!checkIfSignInFormIsValid()}
                  handleSubmit={handleSignIn}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="signup">
            <Card className="p-6 space-y-4">
              <CardHeader>
                <CardTitle>Create a new account</CardTitle>
                <CardDescription>
                  Enter your details to get started
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <CommonForm
                  formControls={signUpFormControls}
                  buttonText={"Sign Up"}
                  formData={signUpFormData}
                  setFormData={setSignUpFormData}
                  isButtonDisabled={!checkIfSignUpFormIsValid()}
                  handleSubmit={handleSignUp}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default AuthPage;