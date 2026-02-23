import { Heart, Store, User } from "lucide-react";
import Link from "next/link";
import React from "react";
import { MobileSidebar } from "./header/MobileSidebar";
import { MobileSearch } from "./MobileSearch";

export default function BottomNavMobile() {
  return (
    <div className="bottom-0 fixed z-[9999] md:hidden shadow-lg shadow-gray-600 bg-white w-full">
      <div className="grid grid-cols-5 px-3 py-2">
        <Link
          href="/store"
          className="flex flex-col items-center gap-1 text-[#3e445a] "
        >
          <Store className="w-7 h-7" />
          <p className="font-bold font-dosis">Store</p>
        </Link>

        <div
          className=" cursor-pointer flex flex-col items-center gap-1 text-[#3e445a] "
        >
          <MobileSearch />
          <p className="font-bold font-dosis">Search</p>
        </div>

        <Link
          href="/my-account/wishlist"
          className="flex flex-col items-center gap-1 text-[#3e445a] "
        >
          <Heart className="w-7 h-7" />
          <p className="font-bold font-dosis">Wishlist</p>
        </Link>

        <Link
          href="/my-account"
          className="flex flex-col items-center gap-1 text-[#3e445a] "
        >
          <User className="w-7 h-7" />
          <p className="font-bold font-dosis">Account</p>
        </Link>

        <div
          className="flex flex-col items-center gap-1 text-[#3e445a] "
        >
          <MobileSidebar />
          <p className="font-bold font-dosis">Categories</p>
        </div>
      </div>
    </div>
  );
}
