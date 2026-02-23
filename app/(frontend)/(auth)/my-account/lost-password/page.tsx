"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { lostPasswordSchema } from "@/lib/zodSchema";
import { toast } from "sonner";
import { useLostPasswordMutation } from "@/redux/appData";
import Recaptcha from "@/components/local/Recaptcha";
import { useCaptcha } from "@/hooks/use-captcha";

export default function LostPassword() {
  const [globalError, setGlobalError] = useState<string>("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { captchaRef, getCaptchaToken, resetCaptcha } = useCaptcha();

  const [
    lostPassword,
    {
      isLoading: isLoadingReset,
      isSuccess: isSuccessLostPassword,
      isError: isErrorLostPassword,
      error: errorLostPassword,
    },
  ] = useLostPasswordMutation();

  const form = useForm<z.infer<typeof lostPasswordSchema>>({
    resolver: zodResolver(lostPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof lostPasswordSchema>) => {
    setGlobalError("");
    try {
      const captcha = getCaptchaToken(); // Use the getCaptchaToken function from the hook
      if (!captcha) {
        setGlobalError("Please complete the CAPTCHA verification.");
        return;
      }

      resetCaptcha();
      const credentials = {
        ...values, // This will include email and password from the form
        captcha, // Add CAPTCHA token
      };
      await lostPassword(credentials);
      //   console.log(result);
    } catch (error) {
      // toast.error("An unexpected error occurred.");
      setGlobalError("An unexpected error occurred.");
      console.error("An error occurred:", error);
    }
  };

  React.useEffect(() => {
    if (isSuccessLostPassword) {
      router.push("/my-account/lost-password?reset-link-sent=true");
      toast.success("Password reset email sent successfully.", {
        position: "top-center",
      });
    } else if (isErrorLostPassword) {
      if (
        "data" in errorLostPassword &&
        typeof errorLostPassword.data === "object"
      ) {
        const errorMessage = (errorLostPassword.data as { message?: string })
          ?.message;
        setGlobalError(errorMessage || "Failed to send password reset email.");
        toast.error(errorMessage || "Failed to send password reset email.", {
          position: "top-center",
        });
      } else {
        setGlobalError("An unexpected error occurred.");
        toast.error("An unexpected error occurred.", {
          position: "top-center",
        });
      }
    }
  }, [isSuccessLostPassword, isErrorLostPassword, errorLostPassword, router]);

  const resetLinkSent = searchParams.get("reset-link-sent") === "true";

  return (
    <>
      {!resetLinkSent ? (
        <div className="px-2 md:px-10 my-10">
          {globalError && <ErrorMessage error={globalError} />}
          <p className="mb-3 text-sm text-gray-500">
            Lost your password? Please enter your email address. You will
            receive a link to create a new password via email.
          </p>
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
              <Recaptcha captchaRef={captchaRef} />

              <div className="">
                {isLoadingReset ? (
                  <Button
                    disabled
                    className="bg-ysecondary flex items-center justify-center gap-1"
                    type="submit"
                  >
                    <span>Please wait</span>
                    <Loader className="animate-spin" />
                  </Button>
                ) : (
                  <Button className="bg-yprimary " type="submit">
                    Reset Password
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </div>
      ) : (
        <div className="px-2 md:px-10 my-10 space-y-5">
          <p className="border p-5 text-sm text-gray-500">
            Password reset email has been sent.
          </p>

          <p className="text-sm text-gray-500 leading-6 w-[90%]">
            A password reset email has been sent to the email address on file
            for your account, but may take several minutes to show up in your
            inbox. Please wait at least 10 minutes before attempting another
            reset.
          </p>
        </div>
      )}
    </>
  );
}
