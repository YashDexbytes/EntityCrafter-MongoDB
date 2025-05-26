import * as yup from "yup";
export const passwordSchema = yup.object().shape({
  oldPassword: yup.string().required("This field is required"),
  newPassword: yup
    .string()
    .required("This field is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(
      /[@$!%*?&#]/,
      "Password must contain at least one special character",
    ),
  confirmPassword: yup
    .string()
    .oneOf(
      [yup.ref("newPassword")],
      "New password and confirm password doesn't match",
    )
    .required("This field is required"),
});
