"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Recaptcha from "../Recaptcha"; // Assuming you have Recaptcha component already set up
import { useCaptcha } from "@/hooks/use-captcha"; // Assuming this is the custom hook for captcha handling
import { Loader } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useCreateNewsletterMutation } from "@/redux/appData";
// import { toast } from "sonner";

// Zod schema for validating the email field
const newsletterSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .nonempty("Email is required"),
});

type NewsletterFormValues = z.infer<typeof newsletterSchema>;

export default function NewsLetter() {
  const [globalError, setGlobalError] = useState<string>("");
  const { captchaRef, getCaptchaToken, resetCaptcha } = useCaptcha(); // Captcha methods
  const form = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: "",
    },
  });

  const [createNewsletter, { isLoading, isSuccess, error, isError }] =
    useCreateNewsletterMutation();

  const onSubmit = async (values: z.infer<typeof newsletterSchema>) => {
    setGlobalError("");
    try {
      const captcha = getCaptchaToken(); // Use the getCaptchaToken function from the hook
      if (!captcha) {
        setGlobalError("Please complete the CAPTCHA verification.");
        return;
      }

      resetCaptcha();
      const credentials = {
        ...values,
        captcha,
      };

      await createNewsletter(credentials);
      // console.log(result);
    } catch (error) {
      // toast.error("An unexpected error occurred.");
      setGlobalError("An unexpected error occurred.");
      console.error("An error occurred:", error);
    }
  };

  React.useEffect(() => {
    if (isSuccess) {
      toast.success("Subscription successful.", {
        position: "top-center",
      });
      form.reset();
    } else if (isError) {
      if ("data" in error && typeof error.data === "object") {
        const errorMessage = (error.data as { message?: string })?.message;
        setGlobalError(errorMessage || "Failed to subscribe.");
        toast.error(errorMessage || "Failed to subscribe.", {
          position: "top-center",
        });
      } else {
        setGlobalError("An unexpected error occurred.");
        toast.error("An unexpected error occurred.", {
          position: "top-center",
        });
      }
    }
  }, [isSuccess, isError, form, error]);

  return (
    <div className="bg-ysecondary text-white pt-10 px-5 md:px-10 flex flex-col md:flex-row gap-10 relative">
      {/* Left Content */}
      <div className="flex-1 space-y-4 md:pb-10">
        {/* <p className="text-lg font-light">$20 discount for your first order</p> */}
        <h2 className="text-2xl lg:text-3xl font-semibold leading-tight">
          Join our newsletter and get...
        </h2>
        <p className="text-gray-200 text-[13px] lg:w-[70%]">
          Join our email subscription now to get updates on promotions and
          coupons.
        </p>

        {/* Subscription Form */}
        <div className="relative">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <div className="">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            className="bg-[#f3f4f7] p-7 w-full text-gray-900"
                            type="email"
                            placeholder="Enter your email"
                            autoComplete="off"
                            {...field}
                          />
                          <div className="absolute top-1/2 right-3 transform -translate-y-1/2">
                            {isLoading ? (
                              <Button
                                disabled
                                className="bg-ysecondary flex items-center justify-center gap-1"
                                type="submit"
                              >
                                <span>Please wait</span>
                                <Loader className="animate-spin" />
                              </Button>
                            ) : (
                              <Button
                                className="bg-yprimary hover:bg-green-400"
                                type="submit"
                              >
                                Subscribe
                              </Button>
                            )}
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />{" "}
              </div>
              {/* Recaptcha */}
              <Recaptcha captchaRef={captchaRef} />

              {globalError && (
                <p className="text-red-500 text-sm mt-2">{globalError}</p>
              )}
            </form>
          </Form>
        </div>
      </div>

      {/* Right Content - Image */}
      <div className="flex-1 relative">
        <Image
          src="https://klbtheme.com/bacola/wp-content/uploads/2021/04/coupon.png"
          alt="Discount Placeholder"
          className="w-full h-full"
          width={300}
          height={200}
        />
      </div>
    </div>
  );
}
