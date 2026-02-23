"use client";
import React, { useState, useEffect } from "react";
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

import { changePasswordSchema } from "@/lib/zodSchema";
import { toast } from "sonner";
import {
  useChangePasswordMutation,
  useVerifyPasswordLinkMutation,
} from "@/redux/appData";
import Link from "next/link";

export default function ChangePassword() {
  const [globalError, setGlobalError] = useState<string>("");
  const [isVerified, setIsVerified] = useState<boolean>(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");
  const userId = searchParams.get("userId");

  const [
    changePassword,
    {
      isLoading: isLoadingChangePassword,
      isSuccess: isSuccessChangePassword,
      isError: isErrorChangePassword,
      error: errorChangePassword,
    },
  ] = useChangePasswordMutation();

  const [
    verifyPasswordLink,
    {
      isLoading: isLoadingVerifyPasswordLink,
      isSuccess: isSuccessVerifyPasswordLink,
      isError: isErrorVerifyPasswordLink,
      error: errorVerifyPasswordLink,
    },
  ] = useVerifyPasswordLinkMutation();

  // Verify the password link on page load
  useEffect(() => {
    if (token && userId) {
      (async () => {
        try {
          await verifyPasswordLink({ token, userId });
          //   console.log(results);
          //   setIsVerified(true);
        } catch (error) {
          console.log(error);
          setGlobalError("The reset link is invalid or has expired.");
        }
      })();
    } else {
      //   setGlobalError("Missing token or user ID.");
    }
  }, [token, userId, verifyPasswordLink]);

  const form = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof changePasswordSchema>) => {
    setGlobalError("");
    try {
      const result = await changePassword({ ...values, userId });
      console.log(result);
    } catch (error) {
      setGlobalError("An unexpected error occurred.");
      console.error("An error occurred:", error);
    }
  };

  useEffect(() => {
    // Handle verifyPasswordLink success and error
    if (isSuccessVerifyPasswordLink) {
      setIsVerified(true);
      setGlobalError("");
      toast.success(
        "Verification successful. You can now change your password.",
        {
          position: "top-center",
        }
      );
      //   const cleanUrl = new URL(window.location.href);
      //   cleanUrl.search = ""; // Remove all query parameters
      //   router.replace(cleanUrl.toString(), undefined);
    } else if (isErrorVerifyPasswordLink) {
      if (
        "data" in errorVerifyPasswordLink &&
        typeof errorVerifyPasswordLink.data === "object"
      ) {
        const errorMessage = (
          errorVerifyPasswordLink.data as { error?: string }
        )?.error;
        // setGlobalError(errorMessage || "Verification failed.");
        toast.error(errorMessage || "Verification failed.", {
          position: "top-center",
        });
      } else {
        setGlobalError("An unexpected error occurred during verification.");
        toast.error("An unexpected error occurred during verification.", {
          position: "top-center",
        });
      }
    }
  }, [
    isSuccessVerifyPasswordLink,
    isErrorVerifyPasswordLink,
    errorVerifyPasswordLink,
    router,
  ]);

  useEffect(() => {
    // Handle verifyPasswordLink success and error

    // Handle changePassword success and error
    if (isSuccessChangePassword) {
      toast.success("Password updated successfully.", {
        position: "top-center",
      });
      router.push("/my-account");
    } else if (isErrorChangePassword) {
      if (
        "data" in errorChangePassword &&
        typeof errorChangePassword.data === "object"
      ) {
        const errorMessage = (errorChangePassword.data as { error?: string })
          ?.error;
        setGlobalError(errorMessage || "Password change failed.");
        toast.error(errorMessage || "Password change failed.", {
          position: "top-center",
        });
      } else {
        setGlobalError("An unexpected error occurred.");
        toast.error("An unexpected error occurred.", {
          position: "top-center",
        });
      }
    }
  }, [
    isSuccessChangePassword,
    isErrorChangePassword,
    errorChangePassword,
    router,
  ]);

  return (
    <div className="px-2 md:px-10 my-10">
      {globalError && <ErrorMessage error={globalError} />}

      {isLoadingVerifyPasswordLink ? (
        <div className="flex items-center justify-center h-32">
          <Loader className="animate-spin text-gray-500" size={48} />
        </div>
      ) : isVerified ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
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
            <FormField
              control={form.control}
              name="confirm_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      className="p-5 bg-gray-100"
                      type="password"
                      placeholder="Confirm new password"
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              {isLoadingChangePassword ? (
                <Button
                  disabled
                  className="bg-ysecondary flex items-center justify-center gap-1"
                  type="submit"
                >
                  <span>Please wait</span>
                  <Loader className="animate-spin" />
                </Button>
              ) : (
                <Button className="bg-yprimary" type="submit">
                  Change Password
                </Button>
              )}
            </div>
          </form>
        </Form>
      ) : (
        <p className="text-red-500">
          Verification failed: {globalError}. Please request a new link here{" "}
          <span className="text-left text-sm mt-2">
            <Link
              href={"/my-account/lost-password"}
              className="text-ysecondary underline"
            >
              Lost your password?
            </Link>
          </span>
        </p>
      )}
    </div>
  );
}
