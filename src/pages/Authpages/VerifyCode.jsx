import React from 'react'
import AuthLayout from "../../components/Layout/AuthLayout";
import AuthCard from "../../components/Layout/AuthCard";
import Button from "../../components/Common/Button";
import { ShieldCheck } from "lucide-react";
import { useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifyCodeSchema } from "../../schemas/authSchema";
import axios from "../../services/axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function VerifyOtp() {
  const {register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: {
      verifyCode: "",
    },
  });
  
  const [loading, setloading] = React.useState(false);

  const navigate = useNavigate()

  const identifier = sessionStorage.getItem("pendingverification")

  const onSubmit = async (data) => {
    setloading(true)
    try {
       const res = await axios.post("/auth/verify-code",{identifier, ...data})

       toast.success(res.data.message)

       sessionStorage.removeItem("pendingverification");

       navigate('/chatify/sign-in')

    } catch (error) {

      console.log(error.response?.data?.message);

      toast.error(error.response?.data?.message);

    }
    finally{
      setloading(false)
    }
  };

  return (
    <AuthLayout>
      <AuthCard>
        {/* Shield Icon */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-600/20 ring-1 ring-violet-500/30">
            <ShieldCheck className="h-8 w-8 text-violet-400" />
          </div>
        </div>

        {/* Heading */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-white">Verify Code</h2>

          <p className="mt-2 text-sm text-zinc-400">
            Enter the 6-digit code sent to your email address.
          </p>
        </div>
         <div className="flex justify-center">
           <form onSubmit={handleSubmit(onSubmit)} >
            <label className="otp mx-auto otp-joined sm:otp-xl ">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>

              <input
                type="text"
                autoComplete="one-time-code"
                inputMode="numeric"
                maxLength={6}
                pattern="[0-9]{6}"
                {...register("verifyCode")}
                disabled = {loading}
              />
            </label>

            {errors.otp && (
              <p className="mt-3 text-center text-sm text-red-500">
                {errors.otp.message}
              </p>
            )}
            <div className="mt-6">
              <Button text="Verify OTP" type="submit" loading={loading}/>
            </div>
          </form>
         </div>

        <p className="mt-6 text-center text-sm text-zinc-400">
          Didn't receive the code?{" "}
          <button
            type="button"
            className="font-medium text-violet-400 transition hover:text-violet-300 hover:underline"
          >
            Resend OTP
          </button>
        </p>
      </AuthCard>
    </AuthLayout>
  );
}

export default VerifyOtp;
