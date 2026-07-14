import React from "react";
import { loginSchema } from "../../schemas/authSchema.js";
import AuthLayout from "../../components/Layout/AuthLayout.jsx";
import AuthCard from "../../components/Layout/AuthCard.jsx";
import Logo from "../../components/Common/Logo.jsx";
import Button from "../../components/Common/Button";
import Input from "../../components/Common/Input";
import { User, Lock, LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "../../services/axios.js";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../redux/auth/authSlice.js";

function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const [loading, setloading] = React.useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const onSubmit = async (data) => {
    setloading(true);
    try {
      const res = await axios.post("/auth/signin", data);

      toast.success(res.data.message);

      dispatch(login(res.data.data))

      navigate("/chatify");
      
    } catch (error) {
      console.log(error.response?.data?.message);

      toast.error(error.response?.data?.message);

      if (error.response?.data?.message === "Please verify your email first.") {

        sessionStorage.setItem("pendingverification", data.identifier);

        navigate("/chatify/verify-account");
      }
    } finally {
      setloading(false);
    }
  };
  return (
    <div>
      <AuthLayout>
        <AuthCard>
          <Logo />

          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-white">Welcome back 👋</h2>

            <p className="mt-2 text-sm text-zinc-400">
              Sign in to continue your conversations.
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Username / Email"
              type="text"
              placeholder="username / email"
              icon={User}
              error={errors.identifier?.message}
              register={register}
              name="identifier"
              loading={loading}
            />

            <Input
              label="Password"
              type="password"
              placeholder="password"
              icon={Lock}
              error={errors.password?.message}
              register={register}
              name="password"
              loading={loading}
            />

            <Button type="submit" text="Sign In" loading={loading} />
          </form>
           <div className="mt-6">
            <p className="text-center text-sm text-white/50">
         
              <Link
                to="/chatify/forgot-password"
                className="font-medium text-violet-400 transition hover:text-violet-300 hover:underline"
              >
                Forget password
              </Link>
            </p>
          </div>
          <div className="mt-6">
            <p className="text-center text-sm text-white/50">
              Don't have an account?{" "}
              <Link
                to="/chatify/sign-up"
                className="font-medium text-violet-400 transition hover:text-violet-300 hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </AuthCard>
      </AuthLayout>
    </div>
  );
}

export default SignIn;
