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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ErrorMessage from "@/components/local/auth/errorMessage";

// import { Separator } from "@/components/ui/separator";
import { Loader } from "lucide-react";
import { registerSchema } from "@/lib/zodSchema";
import { useRegisterMutation } from "@/redux/appData";
import { toast } from "sonner";
import { useCaptcha } from "@/hooks/use-captcha";
import Recaptcha from "../Recaptcha";

// export interface DecodedToken {
//   email: string;
//   action: string;
//   token: string;
// }

export default function Register() {
  const [globalError, setGlobalError] = useState<string>("");
  const { captchaRef, getCaptchaToken, resetCaptcha } = useCaptcha();
  const router = useRouter();

  const [
    register,
    {
      isLoading: isLoadingRegister,
      isSuccess: isSuccessRegister,
      isError: isErrorRegister,
      error: errorRegister,
    },
  ] = useRegisterMutation();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    setGlobalError(""); // Reset global error before submission
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
      await register(credentials);

      // setToken(result?.data?.id);
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
    if (isSuccessRegister) {
      toast.success(`Registration Successful`, {
        // description: "Cart updated",
        // action: {
        //   label: "View cart",
        //   onClick: () => router.push("/cart"),
        // },
        position: "top-center",
      });
      router.refresh();
    } else if (isErrorRegister) {
      if ("data" in errorRegister && typeof errorRegister.data === "object") {
        const errorMessage = (errorRegister.data as { message?: string })
          ?.message;
        setGlobalError(errorMessage || "Registration failed.");
        toast.error(errorMessage || "Registration failed.", {
          position: "top-center",
        });
      } else {
        setGlobalError("An unexpected error occurred.");
        toast.error("An unexpected error occurred.", {
          position: "top-center",
        });
      }
    }
  }, [isSuccessRegister, isErrorRegister, errorRegister, router]);

  return (
    <>
      <div className="max-w-md mx-auto my-10">
        {globalError && <ErrorMessage error={globalError} />}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter your name"
                      autoComplete="off"
                      className="p-5 bg-gray-100"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      autoComplete="off"
                      className="p-5 bg-gray-100"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="w-full ">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter password"
                      autoComplete="off"
                      className="p-5 bg-gray-100"
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
                <FormItem className="w-full ">
                  <FormLabel>Confirm Password</FormLabel>

                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm new password"
                      autoComplete="off"
                      className="p-5 bg-gray-100"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Recaptcha captchaRef={captchaRef} />

            <div className="w-full">
              {isLoadingRegister ? (
                <Button
                  disabled
                  className="bg-ysecondary flex items-center justify-center gap-1 w-full"
                  type="submit"
                >
                  {" "}
                  <span>Please wait</span>
                  <Loader className="animate-spin" />
                </Button>
              ) : (
                <Button className="bg-yprimary w-full" type="submit">
                  Sign Up
                </Button>
              )}
            </div>
          </form>
        </Form>

        {/* <div className="flex items-center justify-between">
          <Separator className="w-[40%]" />

          <p className="text-sm text-gray-500 text-center block my-2">or</p>
          <Separator className="w-[40%]" />
        </div>
        <form className="w-full flex flex-col gap-2">
          <Button
            onClick={handleGoogleSignin}
            variant="outline"
            className="w-full"
            type="submit"
          >
            
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="20"
              height="20"
              viewBox="0 0 48 48"
            >
              <path
                fill="#FFC107"
                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
              <path
                fill="#FF3D00"
                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
              ></path>
              <path
                fill="#4CAF50"
                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
              ></path>
              <path
                fill="#1976D2"
                d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
            </svg>
            <p className="ml-2"> Continue with Google</p>
          </Button>

          <p className="text-center text-sm">
            By signing up, you agree to our{" "}
            <Link href={""} className="text-[#4285F4]">
              Terms & Conditions
            </Link>
            ,{" "}
            <Link href={""} className="text-[#4285F4]">
              Terms of Service
            </Link>{" "}
            and acknowledge that you&apos;ve read our{" "}
            <Link href={""} className="text-[#4285F4]">
              Privacy Policy
            </Link>
            .
          </p>
        </form> */}
      </div>
    </>
  );
}
