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
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

function AuthPage() {
  const [activeTab, setActiveTab] = useState("signin");
  const navigate = useNavigate();

  const {
    signInFormData,
    setSignInFormData,
    signUpFormData,
    setSignUpFormData,
    handleRegisterUser,
    handleLoginUser,
  } = useContext(AuthContext);

  const handleTabChange = (value) => setActiveTab(value);

  const checkIfSignInFormIsValid = () =>
    signInFormData.userEmail.trim() !== "" && signInFormData.password.trim() !== "";

  const checkIfSignUpFormIsValid = () =>
    signUpFormData.userName.trim() !== "" &&
    signUpFormData.userEmail.trim() !== "" &&
    signUpFormData.password.trim() !== "" &&
    signUpFormData.confirmPassword.trim() !== "";

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await handleRegisterUser(e);
      toast.success("Registration successful! Please sign in.");
      setActiveTab("signin");
      setSignUpFormData({
        userName: "",
        userEmail: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error.message ||
        "Registration failed. Please try again.";
      toast.error(message);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await handleLoginUser(e);
      toast.success("Login successful!");
      navigate("/");
    } catch (error) {
      const status = error?.response?.status;
      const message =
        error?.response?.data?.message ||
        (status === 400
          ? "Please fill all required fields correctly."
          : status === 401
          ? "Invalid email or password."
          : status === 403
          ? "Authentication failed. Token expired or invalid."
          : status === 404
          ? "User not found."
          : "Login failed. Please try again.");
      toast.error(message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link to="/" className="flex items-center justify-center">
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
                  buttonText="Sign In"
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
                  buttonText="Sign Up"
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
