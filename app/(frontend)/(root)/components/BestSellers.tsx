"use client";
import ProductCard from "@/components/local/ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useGetAllProductQuery } from "@/redux/appData";
import { Product } from "@/lib/types";
import CustomLoader from "@/components/local/CustomLoader";
import Link from "next/link";

export default function BestSellers() {
  const { data, isLoading, error } = useGetAllProductQuery({
    page: 1,
    limit: 604,
  });

  const bestSellers: Product[] = data?.products.filter(
    (product: Product) => product.isFeatured === true
  );

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <div className="">
          <h2 className="font-dosis uppercase text-[16px] md:text-[20px] text-[#202435] font-semibold">
            Best Sellers
          </h2>
          <p className="text-[#9b9bb4] text-[12px]">
            Do not miss the current offers until the end of March.
          </p>
        </div>
        <Link href="/store">
          <Button
            variant={"outline"}
            className="rounded-[30px] text-[#9b9bb4] text-[12px]"
          >
            View all <ArrowRight className="" />
          </Button>
        </Link>
      </div>
      {isLoading ? (
        <div className="w-full rounded-lg border h-[300px] flex items-center justify-center">
          <CustomLoader />
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-[283px]">
          <p className="text-red-500">Failed to load bestSellers.</p>
        </div>
      ) : (
        <Carousel
          className="w-full rounded-lg border "
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent className="-ml-0">
            {bestSellers.map((data, index) => (
              <CarouselItem key={index} className="pl-0 basis-1/2 lg:basis-1/4">
                <ProductCard data={data} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        // <div>kdjsk</div>
      )}
    </div>
  );
}
