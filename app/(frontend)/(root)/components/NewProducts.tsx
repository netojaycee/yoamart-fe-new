import CustomLoader from "@/components/local/CustomLoader";
import ProductCard from "@/components/local/ProductCard";
import { Button } from "@/components/ui/button";
import { shuffleArray } from "@/hooks/shuffle";
import { Product } from "@/lib/types";
import { useGetAllProductQuery } from "@/redux/appData";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function NewProducts() {
  const { data, isLoading, error } = useGetAllProductQuery({
    page: 1,
    limit: 20,
  });
  const products: Product[] = data ? data.products : [];
  const shuffledData: Product[] = shuffleArray([...products]);
  const newProducts: Product[] = shuffledData.slice(0, 8);

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <div className="">
          <h2 className="font-dosis uppercase text-[16px] md:text-[20px] text-[#202435] font-semibold">
            NEW PRODUCTS
          </h2>
          <p className="text-[#9b9bb4] text-[12px]">
            New products with updated stocks.
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
        <div className="w-full rounded-lg border h-[550px] flex items-center justify-center">
          <CustomLoader />
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-[283px]">
          <p className="text-red-500">Failed to load bestSellers.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 rounded-lg border">
          {newProducts.map((data, index) => (
            <ProductCard newProduct key={index} data={data} />
          ))}
        </div>
      )}
    </div>
  );
}
