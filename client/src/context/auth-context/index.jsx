

import { Skeleton } from "@/components/ui/skeleton";
import { initialSignInFormData, initialSignUpFormData } from "@/config";
import { checkAuthService, loginService, registerService } from "@/services";
import { createContext, useEffect, useState } from "react";
import { toast } from "sonner";

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

  
  if (
    !signUpFormData.userName ||
    !signUpFormData.userEmail ||
    !signUpFormData.password
  ) {
    toast.warning(" Please fill all fields");
    return;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(signUpFormData.userEmail)) {
  toast.error("Please enter a valid email address");
  return;
}


  try {
    setLoading(true);

    const data = await registerService(signUpFormData);

    if (data.success) {
      toast.success(" User registered successfully");

      setSignUpFormData({
        userName: "",
        userEmail: "",
        password: "",
        role: "student",
      });

   
    } else {
      toast.error(data.message || "Registration failed");
    }
  } catch (error) {
    toast.error(
      error?.response?.data?.message || "Something went wrong"
    );
  } finally {
    setLoading(false);
  }
}


  async function handleLoginUser(event) {
  event.preventDefault();

  try {
    const data = await loginService(signInFormData);
    

    if (data.success) {
      toast.success("Login successful");

      sessionStorage.setItem(
        "accessToken",
        JSON.stringify(data.data.accessToken)
      );

      setAuth({
        authenticate: true,
        user: data.data.user,
      });
      console.log("AUTH USER:", auth.user);
    } else {
      toast.error(data.message || "Invalid credentials");

      setAuth({
        authenticate: false,
        user: null,
      });
    }
  } catch (error) {
    toast.error(
      error?.response?.data?.message || "Login failed. Try again."
    );

    setAuth({
      authenticate: false,
      user: null,
    });
  }
}


 

  async function checkAuthUser() {
  const token = sessionStorage.getItem("accessToken");

  if (!token) {
    setLoading(false);
    return;
  }

  try {
    const data = await checkAuthService();
    if (data.success) {
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
    setAuth({
      authenticate: false,
      user: null,
    });
  } finally {
    setLoading(false);
  }
}


  function resetCredentials() {
    setAuth({
      authenticate: false,
      user: null,
    });
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