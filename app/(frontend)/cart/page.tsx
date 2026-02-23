"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { MdCancel } from "react-icons/md";
import { Loader } from "lucide-react";
import NoItemFound from "@/components/local/NoItemFound";
import { RootState } from "@/lib/types";
import { useSelector } from "react-redux";

export default function Cart() {
  const auth = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [error, setError] = useState<string | null>(null);

  const {
    cart,
    handleRemoveFromCart,
    handleCheckout,
    handleClearCart,
    handleDecreaseQuantity,
    handleAddToCart,
    isLoading,
    // isSuccess,
    // isError,
    handleShippingChange,
    handleShippingTypeChange,
    selectedShippingType,
    selectedShipping,
    total,
    mainland,
    island,
  } = useCart();

  const { cartItems } = cart;

  const validateShipping = () => {
    if (!selectedShippingType) {
      setError("Please select a shipping type.");
      return false;
    }
    if (selectedShippingType === "flat-rate" && !selectedShipping) {
      setError("Please select a flat-rate shipping option.");
      return false;
    }
    setError(null);
    return true;
  };

  useEffect(() => {
    if (
      selectedShippingType ||
      (selectedShippingType === "flat-rate" && selectedShipping)
    ) {
      setError("");
    }
  }, [selectedShipping, selectedShippingType]);

  const handleProceedToCheckout = () => {
    if (validateShipping()) {
      if (!auth) {
        const callbackUrl = encodeURIComponent(window.location.href);
        window.location.href = `/my-account?redirect=${callbackUrl}`;
      } else {
        handleCheckout();
      }
    }
  };

  if (cart.cartTotalQuantity < 1) {
    return (
      <NoItemFound
        title1="Your Cart is Empty"
        title2="Looks like you haven't added any items to your cart yet. Start
        browsing our products and add them to your cart."
      />
    );
  }

  return (
    <div className="px-2 md:mx-10">
      {" "}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Cart Items */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2">
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-4">Product</th>
                    <th className="p-4 md:table-cell hidden ">Price</th>
                    <th className="p-4 ">Quantity</th>
                    <th className="p-4 md:table-cell hidden ">Subtotal</th>
                    <th className="p-2 md:table-cell hidden "></th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item._id} className="border-t">
                      <td className="p-4 flex items-center gap-4 relative">
                        <MdCancel
                          onClick={() => handleClearCart()}
                          className="text-red-500 w-6 h-6 cursor-pointer absolute top-1/2 left-1 bg-white rounded-full transform -translate-y-1/2 md:hidden"
                        />{" "}
                        <Image
                          width={70}
                          height={70}
                          src={item?.image[0]}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-md bg-gray-500"
                        />
                        <span>{item.name}</span>
                      </td>
                      <td className="p-4 md:table-cell hidden">
                        {new Intl.NumberFormat("en-NG", {
                          style: "currency",
                          currency: "NGN",
                        }).format(item?.price)}{" "}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDecreaseQuantity(item)}
                            className="w-8 h-8 border rounded-full"
                          >
                            -
                          </button>
                          <span>{item.cartQuantity}</span>
                          <button
                            onClick={() => handleAddToCart(item)}
                            className="w-8 h-8 border rounded-full"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="p-4 md:table-cell hidden">
                        {new Intl.NumberFormat("en-NG", {
                          style: "currency",
                          currency: "NGN",
                        }).format(item.price * item.cartQuantity)}
                      </td>
                      <td className="p-2 md:table-cell hidden">
                        <MdCancel
                          onClick={() => handleRemoveFromCart(item)}
                          className="text-red-500 w-6 h-6 cursor-pointer"
                        />{" "}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end mt-4">
              <Button
                onClick={() => handleClearCart()}
                className="text-sm bg-ysecondary text-white"
              >
                Remove all
              </Button>
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <h2 className="text-lg font-semibold mb-4 font-dosis uppercase">
              Cart Totals
            </h2>
            <Separator className="my-2" />

            {/* Subtotal Section */}
            <div className="flex justify-between mb-4">
              <span className="">Subtotal</span>
              <span className="text-sm font-medium">
                {new Intl.NumberFormat("en-NG", {
                  style: "currency",
                  currency: "NGN",
                }).format(cart.cartTotalAmount)}
              </span>
            </div>

            {/* Shipping Options Section */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2 font-dosis">
                Shipping Options
              </h3>

              <div className="space-y-4">
                {/* Flat Rate Shipping Option */}
                <div className="">
                  <div className="flex items-center justify-between mb-2">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="shipping"
                        value="flat-rate"
                        checked={selectedShippingType === "flat-rate"}
                        onChange={handleShippingTypeChange}
                        className="mr-2"
                      />
                      Flat Rate Shipping
                    </label>
                  </div>
                  {selectedShippingType === "flat-rate" && (
                    <div className="ml-4 space-y-2">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="shippingDetail"
                          id="lagos-mainland"
                          value="lagos-mainland"
                          checked={selectedShipping === "lagos-mainland"}
                          onChange={handleShippingChange}
                          className="mr-2"
                        />
                        <label htmlFor="lagos-mainland" className="text-sm">
                          Lagos to Mainland
                        </label>
                        <span className="ml-auto text-sm font-medium">
                          {new Intl.NumberFormat("en-NG", {
                            style: "currency",
                            currency: "NGN",
                          }).format(mainland)}{" "}
                          {/* Example price */}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="shippingDetail"
                          id="lagos-island"
                          className="mr-2"
                          checked={selectedShipping === "lagos-island"}
                          onChange={handleShippingChange}
                          value="lagos-island"
                        />
                        <label htmlFor="lagos-island" className="text-sm">
                          Lagos to Island
                        </label>
                        <span className="ml-auto text-sm font-medium">
                          {new Intl.NumberFormat("en-NG", {
                            style: "currency",
                            currency: "NGN",
                          }).format(island)}{" "}
                          {/* Example price */}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Local Pickup Option */}
                <div className="flex items-center space-x-4 justify-between">
                  <label htmlFor="local-pickup" className="text-sm">
                    {" "}
                    <input
                      type="radio"
                      name="shipping"
                      id="local-pickup"
                      value="pickup"
                      checked={selectedShippingType === "pickup"}
                      onChange={handleShippingTypeChange}
                      className="mr-2"
                    />
                    Local Pickup{" "}
                    <span className="text-xs text-gray-500 italic">
                      (pick up from store)
                    </span>
                  </label>
                  <span className="ml-auto text-sm font-medium">
                    {new Intl.NumberFormat("en-NG", {
                      style: "currency",
                      currency: "NGN",
                    }).format(0)}{" "}
                    {/* Free pickup */}
                  </span>
                </div>
              </div>
            </div>

            {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

            <Separator className="my-3" />

            {/* Total Section */}
            <div className="flex justify-between mb-4">
              <span className="text-sm">Total</span>
              <span className="text-lg font-bold">
                {new Intl.NumberFormat("en-NG", {
                  style: "currency",
                  currency: "NGN",
                }).format(total)}
              </span>
            </div>

            {/* Checkout Button */}
            <div className="w-full">
              {isLoading ? (
                <Button
                  disabled
                  className="w-full bg-ysecondary text-white py-2 rounded-lg"
                  type="submit"
                >
                  <span>Please wait</span>
                  <Loader className="animate-spin" />
                </Button>
              ) : (
                <Button
                  onClick={handleProceedToCheckout}
                  className="w-full bg-ysecondary text-white py-2 rounded-lg"
                  type="button"
                >
                  Proceed to Checkout
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
