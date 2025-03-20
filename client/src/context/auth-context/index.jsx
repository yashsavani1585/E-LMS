import { createContext, useState, useEffect, useCallback } from "react";
import Skeleton from "@/components/ui/skeleton";
import { initialSignInFormData, initialSignUpFormData } from "@/config";
import { checkAuthService, loginService, registerService } from "@/service";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
  const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);
  const [auth, setAuth] = useState({
    authenticate: false,
    user: null,
  });
  const [loading, setLoading] = useState(true);

  // Register User
  const handleRegisterUser = useCallback(async (event) => {
    event.preventDefault();
    try {
      const data = await registerService(signUpFormData);
      console.log("User Registered:", data);
      if (data.success) {
        setSignUpFormData(initialSignUpFormData); // Reset form after successful registration
      }
    } catch (error) {
      console.error("Registration Error:", error);
    }
  }, [signUpFormData]);

  // Login User
  const handleLoginUser = useCallback(async (event) => {
    event.preventDefault();
    try {
      const data = await loginService(signInFormData);
      console.log("Login Response:", data);

      if (data.success) {
        sessionStorage.setItem("accessToken", data.data.accessToken); // Store token securely
        setAuth({
          authenticate: true,
          user: data.data.user,
        });
      } else {
        setAuth({
          authenticate: false,
          user: null,
        });
      }
    } catch (error) {
      console.error("Login Error:", error);
    }
  }, [signInFormData]);

  // Check Authentication
  const checkAuthUser = useCallback(async () => {
    try {
      const data = await checkAuthService();
      if (data.success) {
        setAuth({
          authenticate: true,
          user: data.data.user,
        });
      } else {
        sessionStorage.removeItem("accessToken"); // Clear invalid token
        setAuth({
          authenticate: false,
          user: null,
        });
      }
    } catch (error) {
      console.error("Auth Check Error:", error);
      sessionStorage.removeItem("accessToken"); // Clear token on error
      setAuth({
        authenticate: false,
        user: null,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Reset Credentials
  const resetCredentials = useCallback(() => {
    sessionStorage.removeItem("accessToken"); // Clear token
    setAuth({
      authenticate: false,
      user: null,
    });
  }, []);

  // Check authentication on mount
  useEffect(() => {
    checkAuthUser();
  }, [checkAuthUser]);

  // Context Value
  const contextValue = {
    signInFormData,
    setSignInFormData,
    signUpFormData,
    setSignUpFormData,
    handleRegisterUser,
    handleLoginUser,
    auth,
    resetCredentials,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {loading ? <Skeleton /> : children}
    </AuthContext.Provider>
  );
}