import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import store from "./redux/store/store.js";
import { Provider } from "react-redux";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import ForgotPassword from "./pages/Authpages/ForgotPassword.jsx";
import SignUp from "./pages/Authpages/SignUp.jsx";
import SignIn from "./pages/Authpages/SignIn.jsx";
import VerifyCode from "./pages/Authpages/VerifyCode.jsx";
import VerifyOtp from "./pages/Authpages/VerifyOtp.jsx";
import ResetPassword from "./pages/Authpages/ResetPassword.jsx";
import Chat from './pages/ChatPages/Chat.jsx'
import PublicRoute from "./pages/Routes/PublicRoute.jsx";
import ProtectedRoute from "./pages/Routes/ProtectedRoute.jsx";
import DashBoard from "./pages/DashBoard/DashBoard.jsx";
import SocketProvider from "./context/SocketProvider.jsx";
import ThemeProvider from "./context/ThemeProvider.jsx";

const router = createBrowserRouter([
   {
    path: "/",
    element: <Navigate to="/chatify" replace />,
  },
  {
    path: "/chatify",
    element: <App />,
    children: [

      // Public Routes
      {
        element: <PublicRoute/>,
        children: [
          {
            path: "sign-up",
            element: <SignUp />,
          },
          {
            path: "sign-in",
            element: <SignIn />,
          },
          {
            path: "verify-account",
            element: <VerifyCode />,
          },
          {
            path: "forgot-password",
            element: <ForgotPassword />,
          },
          {
            path: "verify-otp",
            element: <VerifyOtp />,
          },
          {
            path: "reset-password",
            element: <ResetPassword />,
          },
        ],
      },

      // Protected Routes
      {
        element: <ProtectedRoute/>,
        children: [
          {
            index : true,
            element: <Chat/>,
          },
          {
            path : "dash-board",
            element : <DashBoard/>
          }
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
      <SocketProvider>
      <RouterProvider router={router} />
      </SocketProvider>
      </ThemeProvider>
    </Provider>
  </StrictMode>,
);
