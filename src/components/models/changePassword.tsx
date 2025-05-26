import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { passwordSchema } from "../../validations/changePassword";
import { AlertMessage } from "../../interfaces/common";
import { useSelector } from "react-redux";
import { updatePassword } from "@/apiService/passwordService";
import AlertComponent from "../alerts/AlertComponent";
import { useRouter } from "next/navigation";
import { useLogout } from "@/apiService/auth";
interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}
const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
}) => {
  const token = useSelector((state: any) => state.auth.accessToken);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(passwordSchema),
  });
  const logout = useLogout();
  const [alertMessage, setAlertMessage] = useState<AlertMessage | null>(null);
  const router = useRouter();

  const onSubmit = async (data) => {
    try {
      const formData = {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      };
      setAlertMessage(null);
      const response = await updatePassword(token, formData);
      if (response && response.code === 200) {
        // Store success message in local storage
        localStorage.setItem("successMessage", response.message);
        reset();
        onClose();
        await logout();
        router.push("/login");
      }
    } catch (error) {
      console.error("Failed to update password:", error);
      // Extract error message from the error object
      const errorMessage =
        (error as Error).message ||
        "Failed to update password. Please try again.";
      setAlertMessage({
        message: errorMessage,
        type: "error",
      });
      setTimeout(
        () => {
          setAlertMessage(null);
        },
        parseInt(process.env.NEXT_PUBLIC_ALERT_TIMEOUT || "2500", 10),
      );
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  // Effect to handle modal visibility
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; // Prevent background scroll
    } else {
      document.body.style.overflow = "unset"; // Restore scroll
    }
  }, [isOpen]);

  if (!isOpen) return null; // Don't render if not open

  return (
    <>
      <div
        className={`fixed left-0 top-0 z-999999 block flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5 ${isOpen ? "" : "hidden"}`}
      >
        <div className="w-full max-w-142.5 rounded-lg bg-white p-6.5 dark:bg-boxdark">
          {alertMessage && (
            <AlertComponent
              message={alertMessage.message}
              isError={alertMessage.type !== "success"}
              duration={parseInt(
                process.env.NEXT_PUBLIC_ALERT_TIMEOUT || "5000",
                10,
              )}
            />
          )}
          <h3 className="pb-2 text-xl font-bold text-black dark:text-white sm:text-2xl">
            Change Password
          </h3>
          <span className="flex justify-end gap-4 border-t border-stroke pt-4 dark:border-strokedark"></span>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Old Password Field */}
            <div className="mb-4">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Old Password<span className="text-meta-1">*</span>
              </label>
              <input
                type="password"
                {...register("oldPassword")}
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
              />
              {errors.oldPassword && (
                <p className="input-error">{errors.oldPassword.message}</p>
              )}
            </div>
            {/* New Password Field */}
            <div className="mb-4">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                New Password<span className="text-meta-1">*</span>
              </label>
              <input
                type="password"
                {...register("newPassword")}
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
              />
              {errors.newPassword && (
                <p className="input-error">{errors.newPassword.message}</p>
              )}
            </div>
            {/* Confirm Password Field */}
            <div className="mb-4">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Confirm Password<span className="text-meta-1">*</span>
              </label>
              <input
                type="password"
                {...register("confirmPassword")}
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary"
              />
              {errors.confirmPassword && (
                <p className="input-error">{errors.confirmPassword.message}</p>
              )}
            </div>
            <div className="flex justify-end gap-4 border-t border-stroke pt-4 dark:border-strokedark">
              <button type="submit" className="btn">
                Save
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="btn btn-cancel"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
      <div
        className={`fixed inset-0 z-40 bg-black opacity-25 ${isOpen ? "" : "hidden"}`}
      ></div>
    </>
  );
};

export default ChangePasswordModal;
