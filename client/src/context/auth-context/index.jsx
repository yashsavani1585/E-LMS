import Skeleton from "@/components/ui/skeleton";
import { initialSignInFormData, initialSignUpFormData } from "@/config";
import { checkAuthService, loginService, registerService } from "@/service";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
  const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);
  const [auth, setAuth] = useState({
    authenticate: false,
    user: null,
  });
  const [loading, setLoading] = useState(true);

  async function handleRegisterUser(event) {
    event.preventDefault();

    if (signUpFormData.password !== signUpFormData.confirmPassword) {
      throw new Error("Passwords do not match.");
    }

    try {
      const data = await registerService(signUpFormData);
      console.log("User Registered:", data);
      return data;
    } catch (error) {
      console.error("Registration Error:", error);
      throw error;
    }
  }

  async function handleLoginUser(event) {
    event.preventDefault();
    try {
      const data = await loginService(signInFormData);
      console.log("Login Response:", data);

      if (data.success) {
        sessionStorage.setItem("accessToken", data.data.accessToken);
        setAuth({
          authenticate: true,
          user: data.data.user,
        });
      } else {
        throw new Error(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login Error:", error);
      throw error;
    }
  }

  async function checkAuthUser() {
    try {
      const token = sessionStorage.getItem("accessToken");
      if (!token) throw new Error("No token found");

      const data = await checkAuthService();

      if (data.success) {
        setAuth({
          authenticate: true,
          user: data.data.user,
          Authorization: `Bearer ${token}`,
        });
      } else {
        sessionStorage.removeItem("accessToken");
        setAuth({ authenticate: false, user: null });
      }
    } catch (error) {
      console.error("Auth Check Error:", error);
      sessionStorage.removeItem("accessToken");
      setAuth({ authenticate: false, user: null });
    } finally {
      setLoading(false);
    }
  }

  function resetCredentials() {
    sessionStorage.removeItem("accessToken");
    setAuth({ authenticate: false, user: null });
  }

  useEffect(() => {
    checkAuthUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signInFormData,
        setSignInFormData,
        signUpFormData,
        setSignUpFormData,
        handleRegisterUser,
        handleLoginUser,
        auth,
        resetCredentials,
      }}
    >
      {loading ? <Skeleton /> : children}
    </AuthContext.Provider>
  );
}
