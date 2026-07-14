import React from "react";
import AuthLayout from "../../components/Layout/AuthLayout";
import Logo from "../../components/Common/Logo";
import AuthCard from "../../components/Layout/AuthCard";
import Button from "../../components/Common/Button";
import Input from "../../components/Common/Input";
import { User, Mail, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { signupSchema } from "../../schemas/authSchema.js";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "../../services/axios.js";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullname: "",
      username: "",
      email: "",
      password: "",
    },
  });

  const [loading, setLoading] = React.useState(false);

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await axios.post("/auth/signup", data);

      toast.success(res.data.message);

      sessionStorage.setItem("pendingverification", res.data.data.email);

      navigate("/chatify/verify-account");

  
    } catch (error) {

      console.log(error.response?.data?.message);

      toast.error(error.response?.data?.message);

      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <AuthLayout>
        <AuthCard>
          <Logo />

          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-white">
              Create your account
            </h2>

            <p className="mt-2 text-sm text-zinc-400">
              Join Chatify and start conversations in seconds.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Full Name"
              type="text"
              placeholder="Enter your full name"
              icon={User}
              register={register}
              name="fullname"
              error={errors.fullname?.message}
              loading={loading}
            />
            <Input
              label="Username"
              type="text"
              placeholder="Enter your username"
              icon={User}
              register={register}
              name="username"
              error={errors.username?.message}
              loading={loading}
            />
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
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              icon={Lock}
              register={register}
              name="password"
              error={errors.password?.message}
              loading={loading}
            />

            <Button text="Sign Up" type="submit" loading={loading} />
          </form>

          <div className="mt-6">
            <p className="text-center text-sm text-white/50">
              Already have an account?{" "}
              <Link
                to="/chatify/sign-in"
                className="font-medium text-violet-400 transition hover:text-violet-300 hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </AuthCard>
      </AuthLayout>
    </div>
  );
}

export default SignUp;
