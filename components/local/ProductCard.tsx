"use client";

import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
// import Link from "next/link";
import { Info, Minus, Plus } from "lucide-react";
import { MdOutlineZoomOutMap } from "react-icons/md";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import ProductMain from "@/app/(frontend)/store/[id]/components/ProductMain";
import { CartType, FavoritesState, Product } from "@/lib/types";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, decreaseCartQuantity } from "@/redux/slices/cartSlice";
import { useRouter } from "next/navigation";
import {
  addToFavorites,
  removeFromFavorites,
} from "@/redux/slices/favoriteSlice";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export default function ProductCard({
  newProduct,
  data,
}: {
  newProduct?: boolean;
  data: Product;
}) {
  const dispatch = useDispatch();
  const router = useRouter();

  const cart = useSelector((state: { cart: CartType }) => state.cart);
  const cartItem = cart.cartItems.find((item) => item._id === data._id);
  const favoriteItems: Product[] = useSelector(
    (state: FavoritesState) => state.favorites.favoriteItems
  );
  // console.log(favoriteItems);
  const isFavorite = favoriteItems.some((item) => item._id === data?._id);

  const handleAddToCart = (datas: Product) => {
    // console.log(datas);
    // console.log("cart", cart);

    dispatch(addToCart({ datas, router }));
  };

  const handleDecreaseQuantity = () => {
    dispatch(decreaseCartQuantity(data));
  };
  const handleToggleFavorite = (data: Product | undefined) => {
    if (!isFavorite) {
      dispatch(addToFavorites(data));
    } else {
      dispatch(removeFromFavorites(data));
    }
  };

  return (
    <div className="border p-3 group relative z-0 hover:h-auto  hover:z-10 hover:bg-white transform origin-top transition-transform duration-300">
      <div className="space-y-2 relative">
        {/* Icons */}
        <div className="flex flex-col gap-3 absolute top-0 right-0 md:opacity-0 md:group-hover:opacity-100 md:group-hover:translate-x-0 transform transition-all duration-300">
          {/* Zoom Icon */}
          <ProductDialog data={data} />

          {/* Heart Icon with delay */}
          <span
            className={` cursor-pointer p-2 border hover:bg-ysecondary  rounded-full
                           md:translate-x-8 md:group-hover:translate-x-0 text-[#c53b52] hover:text-white transition-all duration-300 delay-100`}
          >
            {isFavorite ? (
              <FaHeart
                className="cursor-pointer w-4 h-4 "
                onClick={() => handleToggleFavorite(data)}
              />
            ) : (
              <FaRegHeart
                className="cursor-pointer w-4 h-4 "
                onClick={() => handleToggleFavorite(data)}
              />
            )}{" "}
          </span>
        </div>

        {/* Product Image */}
        <a
          href={`/store/${data?._id}`}
          className="max-w-[177px] h-[159px] flex  justify-center mx-auto"
        >
          <div className="max-w-[177px] h-[159px] flex  justify-center">
            <Image
              src={data?.image[0]}
              alt="slider"
              width={177}
              height={159}
              className="w-auto h-auto max-w-full max-h-full rounded-lg"
              loading="lazy"
            />
          </div>
        </a>

        {/* Product Text */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href={`/store/${data?._id}`}
                className="line-clamp-1 font-medium text-sm hover:text-yprimary"
              >
                {data?.name}
              </a>
            </TooltipTrigger>
            <TooltipContent>
              <p>{data?.name}</p> {/* Full name displayed on hover */}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <p
          className={`uppercase ${
            data?.inStock ? "text-[#30e682]" : "text-red-500"
          } font-dosis text-[11px] font-semibold`}
        >
          {data?.inStock ? "In stock" : "Out of stock"}
        </p>
        <h2 className="text-[#D51243] font-dosis text-[18px] font-semibold">
          {new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
          }).format(data?.price)}
        </h2>
        {!data.inStock ? (
          <Button
            variant={"outline"}
            className={`cursor-default text-[12px] w-full  rounded-[30px] ${
              newProduct
                ? "hover:bg-gray-400 md:hidden group-hover:flex hover:text-white text-white bg-gray-400"
                : "hover:text-white hover:bg-gray-400 text-white bg-gray-400"
            }`}
          >
            <Info className="mr-1" />
            Out of stock
          </Button>
        ) : cartItem ? (
          //  {/* if item in cart shows plus minus that increases and decreases quantity, the quantity in cart and a toaster with action to view cart */}
          <div className="p-0 text-[12px] w-full border rounded-[30px] flex items-center hover:bg-transparent justify-between">
            <span className="cursor-pointer rounded-tl-[30px] rounded-bl-[30px] bg-[#c2c3c7] p-2 ">
              <Minus
                onClick={handleDecreaseQuantity}
                className="w-[18.5px] h-[18.5px]"
              />
            </span>

            <p className="px-2">{cartItem?.cartQuantity}</p>

            <span className="cursor-pointer rounded-tr-[30px] rounded-br-[30px] bg-[#ffcd00] p-2 ">
              <Plus
                onClick={() => handleAddToCart(data)}
                className="w-[18.5px] h-[18.5px]"
              />
            </span>
          </div>
        ) : (
          // {/* Add to cart Button */}
          <Button
            onClick={() => handleAddToCart(data)}
            variant={"outline"}
            className={` text-[12px] w-full  rounded-[30px] ${
              newProduct
                ? "hover:bg-ysecondary md:hidden group-hover:block hover:text-white text-white bg-ysecondary"
                : "hover:text-white hover:bg-ysecondary text-white bg-ysecondary"
            }`}
          >
            Add to cart
          </Button>
        )}
      </div>
    </div>
  );
}

function ProductDialog({ data }: { data: Product }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <span
          className="cursor-pointer p-2 border hover:bg-ysecondary hover:text-white rounded-full 
                           md:translate-x-8 md:group-hover:translate-x-0 transition-all duration-300"
        >
          <MdOutlineZoomOutMap className="w-4 h-4" />
        </span>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>.</DialogTitle>{" "}
          {/* <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription> */}
        </DialogHeader>
        <ProductMain data={data} />
      </DialogContent>
    </Dialog>
  );
}
