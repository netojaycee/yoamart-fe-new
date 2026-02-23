import { PhoneCall } from "lucide-react";
import Link from "next/link";
import React from "react";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function FooterBottom() {
  return (
    <div className="bg-white  py-8">
      {/* Top Section */}
      <div className="grid grid-cols-1 md:grid-cols-2  gap-4 items-center justify-between px-5 md:px-20 border-b border-gray-200 pb-6">
        {/* Contact Info */}
        <div className="flex  items-center gap-4">
          {/* Phone Icon Placeholder */}
          <div className="w-10 h-10 rounded-full flex items-center justify-center border">
            <PhoneCall className="" />
          </div>
          <div>
            <a
              href="tel:+2348179752333"
              className="text-xl font-semibold text-gray-800"
            >
              +2348179752333
            </a>
            {/* <p className="text-sm text-gray-500">Working 8:00 - 22:00</p> */}
          </div>
        </div>

        {/* Social Media Icons */}
        <div className="flex items-center gap-3 md:justify-end">
          {/* Placeholder Social Icons */}
          <div className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-200">
            <FaFacebookF className="" />
          </div>
          <div className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-200">
            <FaXTwitter className="" />
          </div>
          <div className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-200">
            <FaInstagram className="" />
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-6 px-5 md:px-20 grid grid-cols-1 md:grid-cols-2 items-center  gap-3 text-sm md:mb-0 mb-[50px]">
        {/* Copyright and Privacy Links */}
        <div className="text-gray-500">
          Copyright 2024 © Yoamart. All rights reserved.
        </div>
        <div className="flex gap-4 items-center  md:justify-end">
          <Link
            href="/privacy-policy"
            className="text-gray-500 hover:text-gray-800"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms-and-conditions"
            className="text-gray-500 hover:text-gray-800"
          >
            Terms and Conditions
          </Link>
        </div>
      </div>
    </div>
  );
}
