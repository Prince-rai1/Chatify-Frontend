import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";
import axios from "./services/axios.js";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { login, logout } from "./redux/auth/authSlice.js";
import { Loader, LoaderCircle } from "lucide-react";

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
        {/* Top-Left Violet Glow (Thoda bada aur zyada visible) */}
        <div className="absolute -top-32 -left-32 h-100 w-100 rounded-full bg-violet-600/40 blur-[120px]" />

        {/* Bottom-Right Fuchsia Glow (Pinkish effect) */}
        <div className="absolute -bottom-32 -right-32 h-100 w-100 rounded-full bg-fuchsia-600/30 blur-[120px]" />

        {/* Bottom-Center Blue Glow (Optional - for premium depth) */}
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 h-75 w-75 rounded-full bg-blue-600/20 blur-[120px]" />

        {/* Center Loader */}
        <div className="relative z-10 flex flex-col items-center gap-3">
          <div className="animate-spin text-violet-500">
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
    <div className="h-dvh overflow-hidden">
      <Toaster />
      <Outlet />
    </div>
  );
}

export default App;
