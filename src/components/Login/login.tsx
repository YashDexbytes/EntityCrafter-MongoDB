import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { setToken } from "@/redux/slices/authSlice";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import { checkIsTenant } from "@/utils/isTenant";
import { login } from "@/apiService/auth";
import { getSubdomain } from "@/utils/isTenant";
import AlertComponent from "../alerts/AlertComponent";
interface LoginCredentials {
  email: string;
  password: string;
}

interface Tokens {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiry: string;
  refreshTokenExpiry: string;
}

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isTenant, setIsTenant] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [alertMessage, setAlertMessage] = useState<{
    message: string;
    type: string;
  } | null>(null);
  useEffect(() => {
    setIsTenant(checkIsTenant());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous validation errors
    setEmailError(null);
    setPasswordError(null);
    setGeneralError(null);

    try {
      let hasError = false;

      if (!email) {
        setEmailError("Please enter your email");
        hasError = true;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setEmailError("Please enter a valid email address");
        hasError = true;
      }

      if (!password) {
        setPasswordError("Please enter your password");
        hasError = true;
      } else if (password.length < 8) {
        setPasswordError("Password must be at least 8 characters long");
        hasError = true;
      }

      if (hasError) {
        return;
      }

      const credentials: LoginCredentials = { email, password };
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (isTenant) {
        // headers["x-request-origin"] = `${getSubdomain()}`;
      }

      const { tokens, userData } = await login(credentials, headers);
      // Store tokens in cookies
      setCookies(tokens);

      // Dispatch the token to Redux
      dispatch(
        setToken({
          accessToken: tokens.accessToken,
          expiry: parseInt(tokens.accessTokenExpiry) / (60 * 60 * 24),
        }),
      );

      userData.userType =
        userData.emailId === "staff@mailiator.com"
          ? "Receptionist"
          : userData.userType;

      // Store user data in localStorage
      localStorage.setItem("userInfo", JSON.stringify(userData));

      router.push("/dashboard");
    } catch (err) {
      console.log('Login error caught in component:', err);
      try {
        // Try to parse the error message if it's a JSON string
        const errorObj = JSON.parse(err instanceof Error ? err.message : String(err));
        setGeneralError(errorObj.error.message);
      } catch (parseError) {
        // If parsing fails, use the original error message
        setGeneralError(err instanceof Error ? err.message : "An error occurred during login");
      }
    }
  };

  const setCookies = (tokens: Tokens) => {
    const cookieOptions: Cookies.CookieAttributes = {
      // httpOnly: true,
      // secure: process.env.NODE_ENV !== "development",
      // sameSite: "strict",
      path: "/",
    };

    Cookies.set("accessToken", tokens.accessToken, {
      ...cookieOptions,
      // expires: 3 / (60 * 24),
      expires: parseInt(tokens.accessTokenExpiry) / (60 * 60 * 24), // Convert seconds to days
    });

    Cookies.set("refreshToken", tokens.refreshToken, {
      ...cookieOptions,
      // expires: 10 / (60 * 24),
      expires: parseInt(tokens.refreshTokenExpiry) / (60 * 60 * 24), // Convert seconds to days
    });
  };
  useEffect(() => {
    setAlertMessage(null);
    const message = localStorage.getItem("successMessage");
    if (message) {
      setAlertMessage({ message, type: "success" });
      localStorage.removeItem("successMessage"); // Clear the message after displaying it
    }
    setTimeout(
      () => {
        setAlertMessage(null);
      },
      parseInt(process.env.NEXT_PUBLIC_ALERT_TIMEOUT || "2500", 10),
    );
  }, [setAlertMessage]);

  const logoSrc = "/images/sw-dark.svg"



  return (
    <div id="login-container">
      <div
        className="login-page rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
        id="login-page"
      >
        <div className="login-part flex flex-wrap items-center">
          <div className="hidden w-full md:block md:w-1/2">
            <div className="px-26 py-17.5 text-center">
              <span className="mt-15 inline-block">
                <Link className="mb-5.5 inline-block" href="/" id="logo-link">
                  <Image
                    className="dark:hidden custom-login-logo"
                    src={logoSrc}
                    alt="Logo"
                    width={500}
                    height={30}
                    id="logo-image"
                  />
                </Link>
              </span>
            </div>
          </div>
          <div className="w-full border-stroke dark:border-strokedark md:w-1/2 md:border-l-2">
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
              <div className="flex justify-center">
                <Link
                  className="mb-5.5 inline-block md:hidden"
                  href="/"
                  id="mobile-logo-link"
                >
                  <Image
                    className="w-full dark:hidden"
                    src={logoSrc}
                    alt="Logo"
                    width={500}
                    height={60}
                    id="mobile-logo-image"
                  />
                </Link>
              </div>
              <h2
                className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2"
                id="scheduling-title"
              >
                Login
              </h2>
              {alertMessage && (
                <AlertComponent
                  message={alertMessage.message}
                  isError={alertMessage.type !== "success"}
                  duration={2500}
                />
              )}
              <form noValidate onSubmit={handleSubmit} id="login-form">
                <div className="mb-4">
                  <label
                    className="mb-2.5 block font-medium text-black dark:text-white"
                    htmlFor="email-input"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      id="email-input"
                    />
                    {emailError && (
                      <p className="input-error mt-2" id="email-error">
                        {emailError}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mb-6">
                  <label
                    className="mb-2.5 block font-medium text-black dark:text-white"
                    htmlFor="password-input"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      id="password-input"
                    />
                    {passwordError && (
                      <p className="input-error mt-2" id="password-error">
                        {passwordError}
                      </p>
                    )}
                  </div>
                </div>
                {generalError && (
                  <p className="input-error mb-4" id="general-error">
                    {generalError}
                  </p>
                )}
                <div className="mb-5">
                  <input
                    type="submit"
                    value="Sign In"
                    className="w-full cursor-pointer rounded-lg  bg-primary p-4 text-white transition hover:bg-opacity-90"
                    id="submit-button"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
