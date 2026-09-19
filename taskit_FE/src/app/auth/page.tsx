"use client";

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckSquareIcon } from "lucide-react";
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
      toast.success("Registration successful. Please log in.");
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
    onSuccess: () => {
      // Redirect to dashboard after successful login
      router.push("/dashboard");
    },
    onError: (error: Error) => {
      setError("root", { message: error.message });
    },
  });

  const googleMutation = useMutation({
    mutationFn: (idToken: string) => googleLogin(idToken),
    onSuccess: () => {
      router.push("/dashboard");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Initialize Google Identity Services and render the button
  useEffect(() => {
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const renderGoogleButton = () => {
      const googleWindow = window as unknown as {
        google?: {
          accounts: {
            id: {
              initialize: (config: {
                client_id: string;
                callback: (response: { credential?: string }) => void;
                ux_mode: string;
              }) => void;
              renderButton: (target: HTMLElement, options: Record<string, unknown>) => void;
            };
          };
        };
      };
      const googleApi = googleWindow.google?.accounts?.id;
      if (!googleApi || !googleClientId) return false;

      googleApi.initialize({
        client_id: googleClientId,
        callback: (response) => {
          const idToken = response?.credential;
          if (idToken) {
            googleMutation.mutate(idToken);
          }
        },
        ux_mode: "popup",
      });

      const target = document.getElementById("googleSignInDiv");
      if (target) {
        googleApi.renderButton(target, {
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

  const isBusy = isSubmitting || registerMutation.isPending || loginMutation.isPending;

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-sm"
      >
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary">
            <CheckSquareIcon className="size-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-semibold text-foreground">
            {mode === "signup" ? "Create your account" : "Welcome back"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {mode === "signup"
              ? "Sign up to start organizing your projects"
              : "Log in to continue to TaskIt"}
          </p>
        </div>

        {"root" in errors && errors.root?.message && (
          <div className="mb-3 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
            {errors.root.message}
          </div>
        )}

        {mode === "signup" && (
          <div className="mb-4 space-y-4">
            <div className="grid gap-1.5">
              <Label htmlFor="accountType">Account Type</Label>
              <select
                id="accountType"
                {...register("accountType", {
                  required:
                    mode === "signup" ? "Please select an account type" : false,
                })}
                className="border-input h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                defaultValue=""
              >
                <option value="" disabled>
                  Select account type
                </option>
                <option value="personal">Personal</option>
                <option value="organization">Organization</option>
              </select>
              {errors.accountType && (
                <p className="text-sm text-destructive">{errors.accountType.message}</p>
              )}
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                {...register("name", { required: "Name is required" })}
                placeholder="Your name"
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>
          </div>
        )}

        <div className="mb-4 grid gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email",
              },
            })}
            placeholder="you@example.com"
            autoComplete="email"
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="mb-2 grid gap-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            placeholder={mode === "signup" ? "Create a password" : "••••••••"}
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
          />
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password.message}</p>
          )}
        </div>

        <Button type="submit" disabled={isBusy} className="mt-4 w-full">
          {isBusy
            ? mode === "signup"
              ? "Signing up…"
              : "Signing in…"
            : mode === "signup"
            ? "Sign up"
            : "Login"}
        </Button>

        <div className="mt-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">or</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="mt-4 flex justify-center">
          <div id="googleSignInDiv" />
        </div>

        {mode === "login" ? (
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={switchToSignup}
              className="text-primary hover:underline"
            >
              Sign up
            </button>
          </p>
        ) : (
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <button
              type="button"
              onClick={switchToLogin}
              className="text-primary hover:underline"
            >
              Log in
            </button>
          </p>
        )}
      </form>
    </div>
  );
}
