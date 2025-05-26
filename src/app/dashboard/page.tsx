"use client";

import Dashboard from "@/components/Dashboard";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { useEffect } from "react";
import { useLogout } from "@/apiService/auth";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const logout = useLogout(); // Initialize logout function
  const router = useRouter();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const resetTimeout = () => {
      // Clear existing timeout
      clearTimeout(timeoutId);
      // Set a new timeout for 60 minutes
      timeoutId = setTimeout(
        () => {
          logout(); // Call the logout function
          router.push("/login"); // Use router to navigate to the login page
        },
        15 * 60 * 1000,
      ); // 60 minutes
    };

    const handleUserActivity = () => {
      resetTimeout(); // Reset the timeout on any user activity
    };

    // Add event listeners for user activity
    window.addEventListener("mousemove", handleUserActivity);
    window.addEventListener("keydown", handleUserActivity);
    window.addEventListener("click", handleUserActivity);

    // Set the initial timeout when the component mounts
    resetTimeout();

    return () => {
      // Cleanup: Remove event listeners and clear the timeout on component unmount
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);
      window.removeEventListener("click", handleUserActivity);
      clearTimeout(timeoutId);
    };
  }, [logout, router]); // Add logout and router to the dependency array

  return (
    <DefaultLayout>
      <Dashboard />
    </DefaultLayout>
  );
}






  