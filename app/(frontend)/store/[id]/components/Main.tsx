"use client";
import React from "react";
import { Separator } from "@/components/ui/separator";
import ProductCard from "@/components/local/ProductCard";
import { useGetAllProductQuery, useGetProductByIdQuery } from "@/redux/appData";
import { Product } from "@/lib/types";
import CustomLoader from "@/components/local/CustomLoader";
import ProductMain from "./ProductMain";
import { shuffleArray } from "@/hooks/shuffle";
import NoItemFound from "@/components/local/NoItemFound";

export default function Main({ id }: { id: string }) {
  const { data, isLoading } = useGetAllProductQuery({ page: 1, limit: 60 });
  const { data: product, isLoading: i } = useGetProductByIdQuery(id);
  if (isLoading || i) {
    // Handle the case where the product is not found
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <CustomLoader />
      </div>
    );
  }

  const products: Product[] = data ? data.products : [];
  const productData: Product = product.product;

  // console.log(productData);

  // Check if the produt was found
  if (!productData) {
    return (
      <NoItemFound
        title1="Your Product with this ID was not found"
        // title2="Visit our store now to explore our products"
      />
    );
  }
  const relatedProducts = products.filter(
    (product) =>
      product?.categoryId?._id === productData?.categoryId?._id &&
      product?._id !== productData?._id
  );

  const shuffledData: Product[] = shuffleArray([...relatedProducts]);
  const related: Product[] = shuffledData.slice(0, 4);
  return (
    <div className="px-2 md:px-10 mb-5 pb-5">
      <div className="bg-white p-6 md:p-8 rounded-md space-y-4">
        <ProductMain data={productData} />
      </div>

      <div className="bg-white shadown-md p-10 rounded-md my-10">
        <h1 className="font-dosis uppercase text-[14px] md:text-[18px] text-[#202435] font-semibold">
          DESCRIPTION
        </h1>
        <Separator className="my-3" />

        <p className="mt-2 leading-10">{productData?.description}</p>
      </div>

      <h2 className="font-dosis uppercase text-[16px] md:text-[20px] text-[#202435] font-semibold">
        Related Products
      </h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 rounded-lg border bg-white shadow-md mt-5 justify-center">
        {related.map((data, index) => (
          <ProductCard data={data} key={index} />
        ))}
      </div>
    </div>
  );
}
