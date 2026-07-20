import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";
import axios from "./services/axios.js";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { login, logout } from "./redux/auth/authSlice.js";
import { Loader, LoaderCircle } from "lucide-react";
import ThreeBackground from "./components/Common/ThreeBackground.jsx";

function App() {
  const { isCheckingAuth } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("/user/get-current-user");
        dispatch(login(res.data.data));
      } catch (error) {
        console.log(error.response.data.message);
        dispatch(logout());
      }
    };

    checkAuth();
  }, []);

  console.log();

  if (isCheckingAuth) {
    return (
      <div className="h-screen w-screen overflow-hidden flex justify-center items-center bg-zinc-950 relative">
        <ThreeBackground />
        {/* Center Loader */}
        <div className="relative z-10 flex flex-col items-center gap-3">
          <div className="animate-spin text-theme-500">
            <Loader className="w-12 h-12" />
          </div>
          {/* Optional: Chhota sa loading text jo acha dikhta hai */}
          <span className="text-zinc-400 text-sm font-medium animate-pulse">
            Please wait...
          </span>
        </div>
      </div>
    );
  }
  return (
    <div className="h-dvh overflow-hidden relative">
      <ThreeBackground />
      <Toaster />
      <div className="relative z-10 h-full">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
