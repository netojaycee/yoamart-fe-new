"use client";
import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { clearCredentials } from "@/redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { Separator } from "@/components/ui/separator";
import { RootState } from "@/lib/types";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = useSelector((state: RootState) => state.auth.isAuthenticated);

  const dispatch = useDispatch();
  const router = useRouter();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    // Remove token from cookies
    Cookies.remove("token");

    // Dispatch logout to clear Redux state
    dispatch(clearCredentials());

    // Redirect the user to the login page (or any other page)
    router.push("/my-account");
  };

  const pathname = usePathname();

  // Function to check if the link is active
  const getLinkClass = (route: string) =>
    pathname === route
      ? "text-ysecondary font-semibold hover:underline"
      : "text-gray-400 hover:text-ysecondary hover:underline";

  // Check if the current page is /lost-password or /change-password
  const hideNavbar =
    pathname === "/my-account/lost-password" ||
    pathname === "/my-account/change-password";

  return (
    <div>
      {/* Only render the navbar if we're not on the lost-password or change-password pages */}
      {session && !hideNavbar && (
        <div className="px-2 md:px-10">
          <div className="flex items-center justify-between py-4 border-b mb-6 bg-[#c2c3c7] md:hidden px-2">
            {/* Logo or title */}
            {/* <Link href="/my-account" className="text-2xl font-semibold text-gray-900">
              Dashboard
            </Link> */}

            {/* Mobile Menu Icon */}
            <button
              className="md:hidden text-gray-600"
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Navbar links */}
          <div
            className={`flex md:flex-row flex-col md:space-x-4 ${
              isMobileMenuOpen ? "block" : "hidden"
            } md:flex`}
          >
            <Link className={getLinkClass("/my-account")} href="/my-account">
              DASHBOARD
            </Link>
            <Link
              className={getLinkClass("/my-account/orders")}
              href="/my-account/orders"
            >
              ORDERS
            </Link>
            <Link
              className={getLinkClass("/my-account/account-details")}
              href="/my-account/account-details"
            >
              ACCOUNT DETAILS
            </Link>
            <Link
              className={getLinkClass("/my-account/wishlist")}
              href="/my-account/wishlist"
            >
              WISHLIST
            </Link>
            <p
              onClick={handleLogout}
              className="text-gray-400 hover:text-ysecondary hover:underline"
            >
              LOG OUT
            </p>
          </div>
          <Separator className="my-5" />
        </div>
      )}
      {children}
    </div>
  );
}
