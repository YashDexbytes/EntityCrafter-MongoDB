"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { setToken, clearToken } from "@/redux/slices/authSlice";
import LogIn from "@/components/Login/login";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Dashboard from "@/components/Dashboard";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const Home: React.FC = () => {
  const token = Cookies.get("accessToken");
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = Cookies.get("accessToken");
    if (storedToken) {
      dispatch(
        setToken({
          accessToken: storedToken,
          expiry: parseInt(storedToken) / (60 * 60 * 24),
        }),
      );
    } else {
      dispatch(clearToken());
    }
    setIsLoading(false);
  }, [dispatch]);

  useEffect(() => {
    if (!isLoading) {
      if (!token) {
        <LogIn />;
      }
    }
  }, [token, isLoading]);

  if (isLoading) {
    return null;
  }

  return (
    <>
      {token ? (
        <DefaultLayout>
          <Dashboard />
        </DefaultLayout>
      ) : (
        <LogIn />
      )}
    </>
  );
};

export default Home;
