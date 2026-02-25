"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ErrorMessage from "@/components/local/auth/errorMessage";

import { loginSchema } from "@/lib/zodSchema";
import { toast } from "sonner";
import { useLoginMutation } from "@/redux/appData";
import Link from "next/link";
// import Recaptcha from "../Recaptcha";
// import { useCaptcha } from "@/hooks/use-captcha";

export default function Login() {
  const [globalError, setGlobalError] = useState<string>("");
  const router = useRouter();
  // const { captchaRef, getCaptchaToken, resetCaptcha } = useCaptcha();

  const [
    login,
    {
      isLoading: isLoadingLogin,
      isSuccess: isSuccessLogin,
      isError: isErrorLogin,
      error: errorLogin,
    },
  ] = useLoginMutation();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setGlobalError("");
    try {
      // const captcha = getCaptchaToken(); // Use the getCaptchaToken function from the hook
      // if (!captcha) {
      //   setGlobalError("Please complete the CAPTCHA verification.");
      //   return;
      // }

      // resetCaptcha();
      const credentials = {
        ...values, // This will include email and password from the form
        // captcha, // Add CAPTCHA token
      };
      await login(credentials);
    } catch (error) {
      // toast.error("An unexpected error occurred.");
      setGlobalError("An unexpected error occurred.");
      console.error("An error occurred:", error);
    }
  };

  // const handleGoogleSignin = async () => {
  //   try {
  //     // Trigger the Google sign-in endpoint
  //     if (!googleSigninLoading) {
  //       const result = await googleSigninData; // or whatever the response you expect
  //       // You can handle the data here (e.g., store the token in Redux or navigate to a different page)
  //       console.log(result);
  //     }
  //   } catch (error) {
  //     toast.error("Google sign-in failed. Please try again.");
  //     console.error("Google sign-in error:", error);
  //   }
  // };

  React.useEffect(() => {
    if (isSuccessLogin) {
      toast.success(`Login Successful`, {
        position: "top-center",
      });
    } else if (isErrorLogin) {
      if ("data" in errorLogin && typeof errorLogin.data === "object") {
        const errorMessage = (errorLogin.data as { message?: string })?.message;
        setGlobalError(errorMessage || "Login failed.");
        toast.error(errorMessage || "Login failed.", {
          position: "top-center",
        });
      } else {
        setGlobalError("An unexpected error occurred.");
        toast.error("An unexpected error occurred.", {
          position: "top-center",
        });
      }
    }
  }, [isSuccessLogin, isErrorLogin, errorLogin, router]);

  return (
    <>
      <div className="max-w-md mx-auto my-10">
        {globalError && <ErrorMessage error={globalError} />}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      className="p-5 bg-gray-100"
                      type="email"
                      placeholder="Enter your email"
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex md:flex-row flex-col items-center w-full gap-3">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        className="p-5 bg-gray-100"
                        type="password"
                        placeholder="Enter password"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* <Recaptcha captchaRef={captchaRef} /> */}

            <div className="w-full">
              {isLoadingLogin ? (
                <Button
                  disabled
                  className="bg-ysecondary flex items-center justify-center gap-1 w-full"
                  type="submit"
                >
                  <span>Please wait</span>
                  <Loader className="animate-spin" />
                </Button>
              ) : (
                <Button className="bg-yprimary w-full" type="submit">
                  Sign In
                </Button>
              )}
            </div>
          </form>
        </Form>
        <p className="text-left text-sm mt-2">
          <Link
            href={"/my-account/lost-password"}
            className="text-ysecondary underline"
          >
            Lost your password?
          </Link>
        </p>
      </div>
    </>
  );
}
