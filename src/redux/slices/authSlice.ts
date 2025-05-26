import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
interface AuthState {
  accessToken: string | null;
}

const initialState: AuthState = {
  accessToken:
    typeof window !== "undefined" ? Cookies.get("accessToken") || null : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken(
      state,
      action: PayloadAction<{ accessToken: string; expiry: number }>,
    ) {
      state.accessToken = action.payload.accessToken;
      Cookies.set("accessToken", action.payload.accessToken, {
        expires: action.payload.expiry,
      }); // Store token in cookies with expiry
    },
    clearToken(state) {
      state.accessToken = null;
      Cookies.remove("accessToken"); // Remove token from cookies
    },
  },
});

export const { setToken, clearToken } = authSlice.actions;
export default authSlice.reducer;
