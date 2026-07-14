import React from "react";
import AuthLayout from "../../components/Layout/AuthLayout";
import AuthCard from "../../components/Layout/AuthCard";
import Logo from "../../components/Common/Logo";
import Input from "../../components/Common/Input";
import Button from "../../components/Common/Button";
import { Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema } from "../../schemas/authSchema";
import axios from "../../services/axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {Link} from 'react-router-dom'

function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const [loading, setLoading] = React.useState(false);

  const navigate = useNavigate()

  const onSubmit = async (data) => {
    setLoading(true);
    try {

      const res = await axios.post("/auth/forgot-password",data);
      
      toast.success(res.data.message);

      console.log(data.email)

      sessionStorage.setItem("pendingotp", data.email)

      navigate('/chatify/verify-otp')

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
          <h2 className="text-3xl font-bold text-white">Forgot Password?</h2>

          <p className="mt-4 text-sm text-zinc-400">
            Enter your email address and we'll send you an OTP to reset your
            password.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            icon={Mail}
            register={register}
            name="email"
            error={errors.email?.message}
            loading={loading}
          />

          <Button text="Send OTP" type="submit" loading={loading} />
        </form>

        <p className="mt-6 text-center text-sm text-zinc-400">
          Remember your password?{" "}
          <Link
                to="/chatify/sign-in"
                className="font-medium text-violet-400 transition hover:text-violet-300 hover:underline"
              >
                Login in
              </Link>
        </p>
      </AuthCard>
    </AuthLayout>
  );
}

export default ForgotPassword;
