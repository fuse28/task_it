"use client";

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  registerUser,
  loginUser,
  UserRegistrationData,
  LoginCredentials,
  googleLogin,
} from "./services/auth.service";

type AccountType = "personal" | "organization";

type FormValues = {
  name: string;
  email: string;
  password: string;
  accountType?: AccountType;
};

export default function Auth() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      accountType: undefined,
    },
    mode: "onBlur",
  });

  // Registration mutation
  const registerMutation = useMutation({
    mutationFn: (userData: UserRegistrationData) => registerUser(userData),
    onSuccess: () => {
      alert("Registration successful. Please log in.");
      setMode("login");
      reset({ name: "", email: "", password: "", accountType: undefined });
    },
    onError: (error: Error) => {
      setError("root", { message: error.message });
    },
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => loginUser(credentials),
    onSuccess: (data) => {
      // Redirect to dashboard after successful login
      router.push("/dashboard");
    },
    onError: (error: Error) => {
      setError("root", { message: error.message });
    },
  });

  const googleMutation = useMutation({
    mutationFn: (idToken: string) => googleLogin(idToken),
    onSuccess: (data) => {
      console.log("Google Login Success:", data);
      localStorage.setItem("token", data.token);
      router.push("/dashboard");
    },
  });

  // Initialize Google Identity Services and render the button
  useEffect(() => {
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const renderGoogleButton = () => {
      const googleApi = (window as any).google?.accounts?.id;
      if (!googleApi || !googleClientId) return false;

      googleApi.initialize({
        client_id: googleClientId,
        callback: (response: any) => {
          const idToken = response?.credential as string | undefined;
          if (idToken) {
            googleMutation.mutate(idToken);
          }
        },
        ux_mode: "popup",
      });

      const target = document.getElementById("googleSignInDiv");
      if (target) {
        (window as any).google.accounts.id.renderButton(target, {
          theme: "outline",
          size: "large",
          width: 320,
          shape: "rectangular",
          text: "signin_with",
        });
        return true;
      }
      return false;
    };

    // Try immediately, then retry a few times in case the script hasn't loaded yet
    if (renderGoogleButton()) return;
    const interval = setInterval(() => {
      if (renderGoogleButton()) {
        clearInterval(interval);
      }
    }, 300);
    const timeout = setTimeout(() => clearInterval(interval), 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [googleMutation]);

  async function onSubmit(values: FormValues) {
    clearErrors();

    if (mode === "signup") {
      // Prepare user data for registration
      const userData: UserRegistrationData = {
        name: values.name,
        email: values.email,
        password: values.password,
        accountType: values.accountType!,
      };

      // Call registration mutation
      registerMutation.mutate(userData);
    } else {
      // Prepare credentials for login
      const credentials: LoginCredentials = {
        email: values.email,
        password: values.password,
      };

      // Call login mutation
      loginMutation.mutate(credentials);
    }
  }

  function switchToSignup() {
    setMode("signup");
    clearErrors();
  }

  function switchToLogin() {
    setMode("login");
    clearErrors();
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm border-2 border-solid border-gray-300 rounded-lg p-6 shadow-sm bg-white"
      >
        <h1 className="text-xl font-semibold mb-4 text-center">
          {mode === "signup" ? "Sign up" : "Login"}
        </h1>

        {"root" in errors && errors.root?.message && (
          <div className="mb-3 text-sm text-red-600" role="alert">
            {errors.root.message}
          </div>
        )}

        {mode === "signup" && (
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="accountType"
            >
              Account Type
            </label>
            <select
              id="accountType"
              {...register("accountType", {
                required:
                  mode === "signup" ? "Please select an account type" : false,
              })}
              className="w-full border border-gray-300 mb-4 rounded px-3 py-2 outline-none focus:border-blue-500"
              defaultValue=""
            >
              <option value="" disabled>
                Select account type
              </option>
              <option value="personal">Personal</option>
              <option value="organization">Organization</option>
            </select>
            {errors.accountType && (
              <p className="text-sm text-red-600 mt-2">
                {errors.accountType.message}
              </p>
            )}
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              Name
            </label>
            <input
              id="name"
              type="text"
              {...register("name", {
                required: "Name is required",
              })}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-1 outline-none focus:border-blue-500"
              placeholder="name"
            />
          </div>
        )}

        <label className="block text-sm font-medium mb-1" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email",
            },
          })}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-1 outline-none focus:border-blue-500"
          placeholder="you@example.com"
          autoComplete="email"
        />
        {errors.email && (
          <p className="text-sm text-red-600 mb-2">{errors.email.message}</p>
        )}

        <label className="block text-sm font-medium mb-1" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-1 outline-none focus:border-blue-500"
          placeholder={mode === "signup" ? "Create a password" : "••••••••"}
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
        />
        {errors.password && (
          <p className="text-sm text-red-600 mb-2">{errors.password.message}</p>
        )}

        <button
          type="submit"
          disabled={
            isSubmitting ||
            registerMutation.isPending ||
            loginMutation.isPending
          }
          className="w-full bg-blue-600 text-white mt-5 rounded py-2 disabled:opacity-60 disabled:cursor-not-allowed hover:bg-blue-700 transition"
        >
          {isSubmitting || registerMutation.isPending || loginMutation.isPending
            ? mode === "signup"
              ? "Signing up…"
              : "Signing in…"
            : mode === "signup"
            ? "Sign up"
            : "Login"}
        </button>

        <div className="mt-4 flex items-center">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="px-3 text-xs text-gray-500">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <div className="mt-4 flex justify-center">
          <div id="googleSignInDiv" />
        </div>

        {mode === "login" ? (
          <p className="text-sm text-gray-600 mt-4 text-center">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={switchToSignup}
              className="text-blue-600 hover:underline"
            >
              Sign up
            </button>
          </p>
        ) : (
          <p className="text-sm text-gray-600 mt-4 text-center">
            Already have an account?{" "}
            <button
              type="button"
              onClick={switchToLogin}
              className="text-blue-600 hover:underline"
            >
              Log in
            </button>
          </p>
        )}
      </form>
    </div>
  );
}
