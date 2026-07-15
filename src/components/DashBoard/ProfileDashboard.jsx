import React from "react";
import { X } from "lucide-react";
import ProfilePicture from "./ProfilePicture";
import EditableField from "./EditableField";
import ChangePassword from "./ChangePassword";
import { useNavigate } from "react-router-dom";
import axios from "../../services/axios";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { logout, updateuser, updateFullName, updateUserName } from "../../redux/auth/authSlice";
import { clearChat } from "../../redux/chat/chatSlice";
import { fullNameSchema, userNameSchema } from "../../schemas/userSchema";

function ProfileDashboard({ user }) {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const onSave = async (image) => {
    const formData = new FormData();

    formData.append("profilePic", image);

    try {
      const res = await axios.patch("/user/update-profilepic", formData);

      dispatch(updateuser(res.data.data));

      console.log(res.data.data);

      toast.success(res.data.message);
    } catch (error) {
      console.log(error);

      toast.error(error.response.data.message);
    }
  };

  const signOut = async () => {
    try {
      const res = await axios.get("/auth/signout");

      if (res.data.success) {
        dispatch(logout());

        dispatch(clearChat());

        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error.response?.data?.message);

      toast.error(error.response?.data?.message);
    }
  };

  const newFullName = async (FullName) => {
        try {
          const res = await axios.patch("/user/update-fullname", {fullname : FullName})
          dispatch(updateFullName(res.data.data))
          toast.success(res.data.message)
        } catch (error) {
           console.log(error.response.data.message)
           toast.error(error.response.data.message)
        }
  }

   const newUserName = async (updatedUserName) => {
        try {
          const res = await axios.patch("/user/update-username", {username : updatedUserName})
          dispatch(updateUserName(res.data.data))
          toast.success(res.data.message)
        } catch (error) {
           console.log(error.response.data.message)
           toast.error(error.response.data.message)
        }
  }

  const updatePassword = async (updatedPassword) => {
        try {
          console.log(updatedPassword)
          const res = await axios.patch("/user/update-password", updatedPassword)
          toast.success(res.data.message)
        } catch (error) {
           console.log(error.response.data.message)
           toast.error(error.response.data.message)
        }
  }

  return (
    <div className="flex h-full flex-col bg-zinc-950">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 px-8 py-5 bg-violet-600">
        <div>
          <h1 className="text-3xl font-bold text-white">My Profile</h1>

          <p className="mt-1 text-sm text-zinc-200 font-bold">
            Manage your Chatify account
          </p>
        </div>

        <button
          onClick={() => navigate("/chatify")}
          className="
            rounded-xl
            p-2
            text-zinc-400
            transition
            hover:bg-zinc-800
            hover:text-white
          "
        >
          <X size={24} />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <ProfilePicture user={user} onSave={onSave} />
          </div>

          {/* Right */}
          <div className="space-y-5 lg:col-span-2">
            <EditableField
              label="Full Name"
              value={user.fullname}
              onSave={(value) => newFullName(value)}
              fieldname = "fullname"
              schema = {fullNameSchema}
            />

            <EditableField
              label="Username"
              value={user.username}
              onSave={(value) => newUserName(value)}
              fieldname = "username"
              schema = {userNameSchema}
            />

            <EditableField label="Email" value={user.email} readOnly />

            <ChangePassword  onSave={(updatedPassword) => updatePassword(updatedPassword)}/>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
              <h3 className="mb-4 text-lg font-semibold text-white">Account</h3>

              <button
                className=" flex w-full items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 font-medium text-red-400 transition-all duration-300 hover:bg-red-500 hover:text-whit "
                onClick={signOut}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileDashboard;
