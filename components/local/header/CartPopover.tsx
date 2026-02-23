"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function CartPopover() {
  const {
    cart,
    handleRemoveFromCart,
    // handleCheckout,
    // isLoading,
    // isSuccess,
    // isError,
  } = useCart();

  const { cartItems } = cart;

  return (
    <>
      {cartItems.length > 0 ? (
        <div className="space-y-5 p-3">
          <div className="space-y- overflow-y-auto h-[40vh]">
            {cartItems.map((cartItem, index) => (
              <div key={index}>
                <div className="flex gap-5 items-center">
                  <div
                    // href={`/store/${cartItem._id}`}
                    className="relative w-[70px] h-[62px]"
                  >
                    <span
                      onClick={() => handleRemoveFromCart(cartItem)}
                      className="absolute top-0 left-0 bg-red-500 rounded-full text-white h-4 w-4 flex items-center justify-center"
                    >
                      <X className="h-3 w-3" />
                    </span>
                    <Image
                      src={cartItem?.image[0]}
                      alt={cartItem.name}
                      width={70}
                      height={62}
                      className="w-full object-cover bg-gray-400 h-full rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Link
                      href={`/store/${cartItem._id}`}
                      className="line-clamp-2 text-sm hover:text-yprimary"
                    >
                      {cartItem.name}{" "}
                    </Link>

                    <h2 className="text-sm">
                      {cartItem.cartQuantity} x{" "}
                      <span className="text-[#D51243]">
                        {new Intl.NumberFormat("en-NG", {
                          style: "currency",
                          currency: "NGN",
                        }).format(cartItem.price)}
                      </span>
                    </h2>
                  </div>
                </div>
                <Separator className="my-2" />
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <p className="font-semibold text-[#c2c3c7] text-[16px]">
              Subtotal:
            </p>

            <h2 className="text-[#D51243] font-dosis text-[18px] font-semibold">
              {new Intl.NumberFormat("en-NG", {
                style: "currency",
                currency: "NGN",
              }).format(cart.cartTotalAmount)}
            </h2>
          </div>
          <Separator className="my-2" />

          <div className="flex flex-col justify-between items-center w-full gap-2">
            <Button asChild className="rounded-none w-full" variant={"outline"}>
              <Link href={"/cart"}>View Cart</Link>
            </Button>
            {/* <Button
              onClick={handleCheckout}
              className="rounded-none w-full bg-[#D51243] text-white"
            >
              Checkout
            </Button> */}
          </div>
        </div>
      ) : (
        <div className="p-3 flex flex-col items-center justify-center w-full h-[250px] gap-3 shadow-lg">
          <Image
            src={"/images/error.png"}
            alt="slider"
            width={60}
            height={60}
            className="object-cover "
          />
          <h2 className="text-sm font-semibold text-gray-700 mb-4">
            Your Cart is Empty
          </h2>

          <Button
            onClick={() => (window.location.href = "/store")} // Redirect to the store page
            className="bg-ysecondary text-white px-6 py-2 rounded hover:bg-primary/80"
          >
            Browse Products
          </Button>
        </div>
      )}
    </>
  );
}
