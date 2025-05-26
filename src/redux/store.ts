import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import Cookies from "js-cookie"; // Import Cookies for cookie management
import authReducer, { setToken } from "@/redux/slices/authSlice";

const persistConfig = {
  key: "root",
  storage: {
    getItem: (key) => Promise.resolve(Cookies.get(key)), // Return a promise
    setItem: (key, value) => {
      const decodedValue = decodeURIComponent(value);
      const tokenData = JSON.parse(decodedValue); // Assuming the token is a JSON string
      const expiresInDays = tokenData.expiry / (60 * 60 * 24); // Convert seconds to days
      Cookies.set(key, decodedValue, { expires: expiresInDays }); // Set expiry based on token
      // store.dispatch(setToken(tokenData));
      return Promise.resolve(); // Return a promise
    },
    removeItem: (key) => {
      Cookies.remove(key);
      return Promise.resolve(); // Return a promise
    },
  },
};

const persistedReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
