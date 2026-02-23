"use client";
import React, { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Recaptcha from "./Recaptcha";
import { useCaptcha } from "@/hooks/use-captcha";
import { useCreateContactMutation } from "@/redux/appData";
import { Loader2 } from "lucide-react";

// Define the validation schema using zod
const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message cannot be empty"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactForm() {
  const [globalError, setGlobalError] = useState<string>("");
  const { captchaRef, getCaptchaToken, resetCaptcha } = useCaptcha();
  const [createContact, { isLoading }] = useCreateContactMutation();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (values: ContactFormData) => {
    setGlobalError(""); // Reset global error
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
      // console.log(credentials);

      const result = await createContact(credentials);
      if (result?.data) {
        toast.success("Message sent successfully!", {
          position: "top-center",
        });
      } else {
        setGlobalError("An unexpected error occurred. Please try again.");
        toast.error("An unexpected error occurred.", {
          position: "top-center",
        });
      }

      // Reset the form after successful submission
      form.reset();
    } catch (error) {
      console.error("Error:", error);
      setGlobalError("An unexpected error occurred. Please try again.");
      toast.error("An unexpected error occurred.", {
        position: "top-center",
      });
    }
  };

  return (
    <div className=" my-10 p-8">
      {globalError && (
        <div className="text-red-600 text-center mb-4">{globalError}</div>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your name</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                      placeholder="Your name"
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
                  <FormLabel>Your email</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                      placeholder="Your email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <FormControl>
                  <input
                    {...field}
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                    placeholder="Subject"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your message</FormLabel>
                <FormControl>
                  <textarea
                    {...field}
                    rows={6}
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                    placeholder="Your message"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Recaptcha captchaRef={captchaRef} />

          <div className="w-full mt-4">
            {isLoading ? (
              <Button
                disabled
                className="bg-ysecondary hover:bg-ysecondary/80 flex items-center justify-center gap-1 w-full"
                type="submit"
              >
                <span>Please wait</span>
                <Loader2 className="animate-spin" />
              </Button>
            ) : (
              <Button
                className="bg-ysecondary hover:bg-ysecondary/80 w-full"
                type="submit"
                onClick={form.handleSubmit(onSubmit)}
              >
                Send Message
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
