"use client";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselOptions,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import { FavoritesState, Product } from "@/lib/types";
import { addToCart } from "@/redux/slices/cartSlice";
import {
  addToFavorites,
  removeFromFavorites,
} from "@/redux/slices/favoriteSlice";
import { Heart, Minus, Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

export default function ProductMain({ data }: { data: Product }) {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = React.useState(1);

  const router = useRouter();
  const favoriteItems: Product[] = useSelector(
    (state: FavoritesState) => state.favorites.favoriteItems
  );
  // console.log(favoriteItems);
  const isFavorite = favoriteItems.some((item) => item._id === data?._id);

  const handleAddToCart = (datas: Product, quantity: number) => {
    dispatch(addToCart({ datas, quantity, router }));
  };

  const handleToggleFavorite = (data: Product | undefined) => {
    if (!isFavorite) {
      dispatch(addToFavorites(data));
    } else {
      dispatch(removeFromFavorites(data));
    }
  };

  return (
    <div className="">
      <h1 className="text-[25px]  font-semibold leading-7 mb-4">
        {data?.name}
      </h1>
      <div className="flex md:flex-row flex-col gap-5">
        <div className="w-full lg:w-1/2 space-y-5 flex flex-col items-center justify-center">
          <ProductImages images={data?.image} />
        </div>
        <div className="w-full lg:w-1/2 flex lg:flex-row flex-col gap-10">
          <div className="space-y-5 w-full">
            <h2 className="text-[#D51243] font-dosis text-[25px] font-semibold">
              {new Intl.NumberFormat("en-NG", {
                style: "currency",
                currency: "NGN",
              }).format(data?.price)}
            </h2>
            <p
              className={`uppercase text-center py-2 w-1/3 rounded-[30px]  ${
                data?.inStock
                  ? "text-[#30e682] bg-[#30e682]/10"
                  : "text-red-500 bg-red-500/10"
              } font-dosis text-[11px] font-semibold`}
            >
              {data?.inStock ? "In stock" : "Out of stock"}
            </p>
            <p className="line-clamp-4 leading-10">{data?.description}</p>
            <div className="flex  items-center gap-10 w-full  p-2">
              <div className="flex items-center justify-between gap-6">
                <span className="bg-[#c2c3c7] hover:bg-[#ffcd00] cursor-pointer h-10 w-10 p-1 rounded-full flex items-center justify-center">
                  <Minus
                    onClick={() => setQuantity(Math.max(quantity - 1, 1))}
                    className=""
                  />
                </span>
                <p className="font-semibold text-[16px]"> {quantity}</p>
                <span className="bg-[#c2c3c7] hover:bg-[#ffcd00] cursor-pointer h-10 w-10 p-1 rounded-full flex items-center justify-center">
                  <Plus
                    onClick={() => setQuantity(quantity + 1)}
                    className=""
                  />
                </span>
              </div>
              <div className="">
                {!data.inStock ? (
                  <Button
                    className={`p-5 text-[12px]   rounded-[30px] hover:bg-gray-400  text-white bg-gray-400`}
                  >
                    Out of stock
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleAddToCart(data, quantity)}
                    className={`p-5 text-[12px]   rounded-[30px] hover:bg-yprimary/70  text-white bg-yprimary`}
                  >
                    Add to cart
                  </Button>
                )}
              </div>
            </div>
            <Button
              onClick={() => handleToggleFavorite(data)}
              variant={"outline"}
              className={`p-5 text-[12px]   rounded-[30px] `}
            >
              <Heart /> Add to Wishlist
            </Button>{" "}
            <Separator />
            <p className="text-[#c2c3c7] text-sm">
              Category:{" "}
              <span className="font-semibold text-black/50">
                {data?.categoryId?.name}
              </span>
            </p>
          </div>
          {/* <div className="w-full lg:w-1/2">3</div> */}
        </div>
      </div>
    </div>
  );
}

function ProductImages({ images }: { images: string[] }) {
  // const [rating, setRating] = React.useState(4);
  const carouselOpts = {
    align: "start",
    loop: false,
  } as CarouselOptions;

  // const imagesArray: string[] = [images, images, images];

  return (
    <Carousel
      customControls={true}
      controlAlignment="center"
      opts={carouselOpts}
      images={images}
    >
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index}>
            <div className="w-full flex items-center justify-center h-[230px] lg:h-[393px]">
              <Image
                src={image}
                alt="slider"
                width={430}
                height={393}
                className="object-contain h-full w-full rounded-lg bg-white"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
