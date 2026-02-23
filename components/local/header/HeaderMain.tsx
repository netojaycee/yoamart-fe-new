"use client";
import { ShoppingCartIcon, UserRound } from "lucide-react";
import React, { useState } from "react";
import Logo from "../Logo";
import HeaderBottom from "./HeaderBottom";
import { MobileSidebar } from "./MobileSidebar";
import CartPopover from "./CartPopover";
import Link from "next/link";
import { getTotals } from "@/redux/slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { CartType } from "@/lib/types";

import SearchBar from "../SearchBar";

export default function HeaderMain() {
  const [isVisible, setIsVisible] = useState(false);

  const dispatch = useDispatch();
  const cart = useSelector((state: { cart: CartType }) => state.cart);

  React.useEffect(() => {
    dispatch(getTotals());
  }, [dispatch]);

  const handleMouseEnter = () => {
    // if (window.innerWidth >= 768) {
    // Trigger only for larger screens
    setIsVisible(true);
    // }
  };

  const handleMouseLeave = () => {
    // Trigger only for larger screens
    setIsVisible(false);
  };

  const handleClick = () => {
    // Trigger only for mobile screens
    setIsVisible((prev) => !prev);
  };

  return (
    <>
      <div className=" pt-2 md:pt-5 pb-2 border-b border-gray-300 shadow-sm md:shadow-none">
       <div className="flex flex-col gap-6 px-2 lg:px-10 max-w-7xl mx-auto">
        <div className="flex justify-between items-center md:gap-10 lg:gap-[60px]">
          {/* <Menu className="w-7 h-7 lg:hidden  md:hidden" /> */}
          <div className="w-7 h-7 lg:hidden  md:hidden">
            <MobileSidebar />
          </div>
          <div className="flex items-center gap-2 ">
            <div className="w-7 h-7 lg:hidden hidden md:block">
              <MobileSidebar />
            </div>
            <Logo />
          </div>
          <div className="hidden md:block w-full">
           
            <SearchBar />
          </div>
          <div className="flex items-center gap-5 justify-end">
            <Link
              href="/my-account"
              className="border rounded-full p-[10px] hidden md:block"
            >
              <UserRound className="w-5 h-5 " />
            </Link>
            <div
              onClick={handleClick}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="relative flex items-center gap-2 delay-300 cursor-pointer"
            >
              <p className="font-semibold font-dosis text-[16px]">
                {new Intl.NumberFormat("en-NG", {
                  style: "currency",
                  currency: "NGN",
                }).format(cart.cartTotalAmount)}
              </p>
              <span className="rounded-full md:bg-[#fff1ee] p-3 relative">
                <ShoppingCartIcon className="w-6 h-6 md:text-[#ea2b0f]" />
                <p className="text-[10px] text-white absolute top-[2px] -right-[4px] rounded-full bg-[#ea2b0f] flex items-center justify-center w-5 h-5">
                  {cart.cartTotalQuantity}
                </p>
              </span>

              {isVisible && (
                <div
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  className="z-10 min-h-[200px] max-h-[75vh] w-[300px] absolute top-[50px] right-0 bg-white border border-gray-300 shadow-lg rounded-md"
                >
                  <CartPopover />
                </div>
              )}
            </div>
          </div>
        </div>

        <HeaderBottom />
      </div>
      </div>
    </>
  );
}
