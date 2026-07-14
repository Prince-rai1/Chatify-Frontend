import React from "react";
import AuthLayout from "../../components/Layout/AuthLayout";
import AuthCard from "../../components/Layout/AuthCard";
import Logo from "../../components/Common/Logo";
import Input from "../../components/Common/Input";
import Button from "../../components/Common/Button";
import { Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "../../schemas/authSchema";
import axios from "../../services/axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function ResetPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const [loading, setLoading] = React.useState(false);

  const navigate = useNavigate()

  const resetToken = sessionStorage.getItem("resetToken");

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const res = await axios.post("/auth/reset-password", {
        ...data,
        resetToken,
      });

      toast.success(res.data.message);

      navigate('/chatify/sign-in')

    } catch (error) {

     console.log(error.response?.data?.message);

      toast.error(error.response?.data?.message);

      
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthCard>
        <Logo />

        <div className="mb-8 mt-8 text-center">
          <h2 className="text-3xl font-bold text-white">Create New Password</h2>

          <p className="mt-4 text-sm text-zinc-400">
            Choose a strong password to secure your Chatify account.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="New Password"
            type="password"
            placeholder="Enter new password"
            icon={Lock}
            register={register}
            name="password"
            error={errors.password?.message}
            loading={loading}
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            icon={Lock}
            register={register}
            name="confirmPassword"
            error={errors.confirmPassword?.message}
            loading={loading}
          />

          <Button text="Reset Password" type="submit" loading={loading} />
        </form>

        <p className="mt-6 text-center text-sm text-zinc-400">
          Remember your password?{" "}
          <a
            href="/login"
            className="font-medium text-violet-400 hover:underline"
          >
            Back to Login
          </a>
        </p>
      </AuthCard>
    </AuthLayout>
  );
}

export default ResetPassword;
