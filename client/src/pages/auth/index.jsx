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
import { GraduationCap } from "lucide-react";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";

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

  function checkIfSignInFormIsValid() {
    return (
      signInFormData?.userEmail !== "" &&
      signInFormData?.password !== ""
    );
  }

  function checkIfSignUpFormIsValid() {
    return (
      signUpFormData?.userName !== "" &&
      signUpFormData?.userEmail !== "" &&
      signUpFormData?.password !== ""
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">

      <header className="w-full bg-white border-b">
        <div className="max-w-[1440px] mx-auto px-4 h-14 flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-indigo-600" />
            <span className="font-extrabold text-xl text-gray-900">
              LMS LEARN
            </span>
          </Link>
        </div>
      </header>

      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <Tabs
          value={activeTab}
          defaultValue="signin"
          onValueChange={setActiveTab}
          className="w-full max-w-md"
        >
          <TabsList className="grid grid-cols-2 mb-6 bg-white w-full ">
            <TabsTrigger value="signin"
            className="data-[state=active]:bg-gray-200 data-[state=active]:text-gray-900" >Sign In</TabsTrigger>
            <TabsTrigger value="signup" 
            className="data-[state=active]:bg-gray-200 data-[state=active]:text-gray-900">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  Welcome back
                </CardTitle>
                <CardDescription>
                  Sign in to continue learning
                </CardDescription>
              </CardHeader>

              <CardContent>
                <CommonForm
                  formControls={signInFormControls}
                  buttonText="Sign In"
                  formData={signInFormData}
                  setFormData={setSignInFormData}
                  isButtonDisabled={!checkIfSignInFormIsValid()}
                  handleSubmit={handleLoginUser}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  Create your account
                </CardTitle>
                <CardDescription>
                  Start learning with LMS Learn
                </CardDescription>
              </CardHeader>

              <CardContent>
                <CommonForm
                  formControls={signUpFormControls}
                  buttonText="Create Account"
                  formData={signUpFormData}
                  setFormData={setSignUpFormData}
                  isButtonDisabled={!checkIfSignUpFormIsValid()}
                  handleSubmit={handleRegisterUser}
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
