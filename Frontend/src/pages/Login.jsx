import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useRef, useState } from "react";

import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { Link, replace, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  useRegisterMutation,
  useLoginMutation,
  useVerifyUserQuery,
} from "@/app/apis/authApi";
import { useDispatch } from "react-redux";
import { loggedIn } from "@/app/slices/authSlice";
import { Loader2 } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [role, setRole] = useState("");

  useEffect(() => {
    if (location?.state?.role) {
      setRole(location?.state?.role);
    }
  }, [location]);

  const currentTab = location.pathname.includes("signup") ? "signup" : "signin";
  const [activeTab, setActiveTab] = useState(currentTab);

  useEffect(() => {
    setActiveTab(currentTab);
  }, [currentTab]);

  const handleTabChange = (val) => {
    setActiveTab(val);
    navigate(`/${val}`);
  };

  const [showPassword, setShowPassword] = useState(false);
  const nameRef = useRef(null);
  const email_SingupRef = useRef(null);
  const password_SignupRef = useRef(null);
  const email_SiginRef = useRef(null);
  const password_SigninRef = useRef(null);

  const dispatch = useDispatch();

  const [register, { isLoading: registerLoading }] = useRegisterMutation();
  const [signin, { isLoading: signinLoading }] = useLoginMutation();

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("verificationToken");

  const { data, error } = useVerifyUserQuery(token, { skip: !token });

  const hanldeSignin = async () => {
    if (!email_SiginRef.current.value || !password_SigninRef.current.value) {
      toast.error("All fields are required!");
      return;
    }

    try {
      const response = await signin({
        email: email_SiginRef.current.value,
        password: password_SigninRef.current.value,
      }).unwrap();

      if (response?.success) {
        toast.success("Login Successfully!");
        dispatch(loggedIn(response.user));

        email_SiginRef.current.value = "";
        password_SigninRef.current.value = "";

        navigate("/");
      } else {
        toast.error(response?.message || "Error in signin, please try again!");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Error in signin, please try again!");
    }
  };

  const handleSignup = async () => {
    if (
      !email_SingupRef.current.value ||
      !nameRef.current.value ||
      !password_SignupRef.current.value
    ) {
      toast.error("All fields are required!");
      return;
    }

    try {
      const response = await register({
        name: nameRef.current.value,
        email: email_SingupRef.current.value,
        password: password_SignupRef.current.value,
        role,
      }).unwrap();

      if (response?.success) {
        toast.success(
          "Verification link is sent to mail, please check your mail!"
        );
        nameRef.current.value = "";
        email_SingupRef.current.value = "";
        password_SignupRef.current.value = "";
      } else {
        toast.error(
          response?.message ||
            "Error in registering the user, please try again!"
        );
      }
    } catch (err) {
      toast.error(
        err?.data?.message || "Error in registering the user, please try again!"
      );
    }
  };

  useEffect(() => {
    if (!token) {
      return;
    }

    if (data) {
      if (data.success) {
        toast.success("Email verified successfully, please login!");
        navigate("/signin");
      } else {
        toast.error(data.message || "Verification failed, please try again.");
      }
    } else if (error) {
      toast.error(
        error?.data?.message ||
          "Error in verifying the email, please try again!"
      );
    }
  }, [data, token, navigate]);

  const handleGoogleSuccess = async (response) => {
    try {
      const { credential } = response; // Fix: Correct property extraction

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/google-login`,
        { credential, role }, // Fix: Sending correct credential key
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res?.status === 200) {
        dispatch(loggedIn(res?.data?.user));
        toast.success('Signin Successfully!');
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Google Login Failed!");
    }
  };

  const handleGoogleFailure = (error) => {
    toast.error("Google Sign-in failed");
  };

  return (
    <Tabs
      defaultValue={activeTab}
      onValueChange={handleTabChange}
      className="w-[400px] m-auto my-12 max-[400px]:w-full max-[400px]:mx-2"
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="signin" className="cursor-pointer">
          Signin
        </TabsTrigger>
        <TabsTrigger value="signup" className="cursor-pointer">
          Signup
        </TabsTrigger>
      </TabsList>

      <TabsContent value="signin">
        <Card>
          <CardHeader className="text-center text-3xl">
            <CardTitle>Signin</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label
                htmlFor="email"
                className="after:content-['*'] after:text-red-500 after:ml-1"
              >
                Email
              </Label>
              <Input
                type="email"
                placeholder="user@example.com"
                required
                ref={email_SiginRef}
              />
            </div>
            <div className="space-y-1 relative">
              <Label
                htmlFor="password"
                className="after:content-['*'] after:text-red-500 after:ml-1"
              >
                Password
              </Label>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="password"
                required
                ref={password_SigninRef}
              />
              <span
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute bottom-2 right-2 cursor-pointer"
              >
                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
              </span>
            </div>
            <Link
              to="/forgot-password"
              className="flex justify-end text-blue-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </CardContent>
          <CardFooter className="flex justify-center">
            <div className="flex flex-col items-center space-y-4">
              <Button
                disabled={signinLoading}
                className="cursor-pointer bg-[#F90070] hover:bg-[#F90070] text-white"
                onClick={hanldeSignin}
              >
                {signinLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                    Wait
                  </>
                ) : (
                  "Sigin"
                )}
              </Button>
              <span>or</span>
              <div className="flex justify-center max-[300px]:scale-75">
                <GoogleLogin
                  clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleFailure}
                  useOneTap
                />
              </div>
            </div>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="signup">
        <Card>
          <CardHeader className="text-center text-3xl">
            <CardTitle>
              {role === "instructor" ? "Instructor Singup" : "Signup"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label
                htmlFor="name"
                className="after:content-['*'] after:text-red-500 after:ml-1"
              >
                Name
              </Label>
              <Input
                type="text"
                placeholder="John Doe"
                required
                ref={nameRef}
              />
            </div>
            <div className="space-y-1">
              <Label
                htmlFor="email"
                className="after:content-['*'] after:text-red-500 after:ml-1"
              >
                Email
              </Label>
              <Input
                type="email"
                placeholder="user@example.com"
                required
                ref={email_SingupRef}
              />
            </div>
            <div className="space-y-1 relative">
              <Label
                htmlFor="password"
                className="after:content-['*'] after:text-red-500 after:ml-1"
              >
                Password
              </Label>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="password"
                required
                ref={password_SignupRef}
              />
              <span
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute bottom-2 right-2 cursor-pointer"
              >
                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
              </span>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <div className="flex flex-col items-center space-y-4">
              <Button
                disabled={registerLoading}
                className="cursor-pointer bg-[#F90070] hover:bg-[#F90070] text-white"
                onClick={handleSignup}
              >
                {registerLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                    Wait
                  </>
                ) : (
                  "Signup"
                )}
              </Button>
              <span>or</span>
              <div className="flex justify-center max-[300px]:scale-75">
                <GoogleLogin
                  clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleFailure}
                  useOneTap
                />
              </div>
            </div>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default Login;
