"use client";
import Link from "next/link";
import React from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { clearCredentials } from "@/redux/slices/authSlice";
import Cookies from "js-cookie";
import { UserData } from "@/lib/types";

export default function Dashboard({ session }: { session: UserData | null }) {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    // Remove token from cookies
    Cookies.remove("token");

    // Dispatch logout to clear Redux state
    dispatch(clearCredentials());

    // Redirect the user to the login page (or any other page)
    router.push("/my-account");
  };
  return (
    <div className="px-2 md:px-10 my-10">
      <div className="">
        {/* Navigation Links */}

        {/* Welcome Message */}
        <div>
          <p className="text-gray-700">
            Hello <span className="font-bold text-black">{session?.name || session?.email}</span>
            <span className="text-sm text-gray-500">
              (not <span className="text-black">{session?.name || session?.email}</span>?
              <span
                onClick={handleLogout}
                className="text-blue-600 hover:underline"
              >
                {" "}
                Log out
              </span>
              )
            </span>
          </p>

          <p className="text-gray-600 mt-4">
            From your account dashboard, you can view your
            <Link
              className="text-gray-400 hover:text-blue-600 hover:underline"
              href="/my-account/orders"
            >
              <span className="text-blue-600 hover:underline">
                {" "}
                recent orders
              </span>
            </Link>{" "}
            and
            <Link
              className="text-gray-400 hover:text-blue-600 hover:underline"
              href="/my-account/account-details"
            >
              <span className="text-blue-600 hover:underline">
                {" "}
                edit your password and account details
              </span>
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
