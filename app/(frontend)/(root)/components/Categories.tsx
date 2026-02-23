"use client";
import CustomLoader from "@/components/local/CustomLoader";
import { shuffleArray } from "@/hooks/shuffle";
import { Category } from "@/lib/types";
import { useGetAllCategoryQuery } from "@/redux/appData";
import Image from "next/image";
import Link from "next/link";
import React from "react";


export default function Categories() {
  const { data, isLoading, error } = useGetAllCategoryQuery(undefined);
  // console.log(data && data);
  // Shuffle data and pick the first 9 categories
  const category: Category[] = data ? data.category : [];
  const shuffledData: Category[] = shuffleArray([...category]);
  const featuredCategory: Category | undefined = shuffledData[0];
  const remainingCategories: Category[] = shuffledData.slice(0, 9);

  return (
    <div className="pb-10 px-2 md:px-10">
      <div className="border rounded-lg">
        {isLoading ? (
          <div className="flex items-center justify-center h-[283px]">
            <CustomLoader />{" "}
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-[283px]">
            <p className="text-red-500">Failed to load categories.</p>
          </div>
        ) : (
          <div className="flex md:flex-row flex-col w-full">
            {/* Featured Category */}
            {featuredCategory && (
              <div className="space-y-2 border-[1.5px] p-4 flex flex-col items-center justify-center">
                <Link
            href={`/store/?category=${featuredCategory?._id}`}
            className="cursor-pointer w-[193px] h-[193px]"
                >
                  <Image
                    src={featuredCategory.image}
                    alt={featuredCategory.name}
                    width={193}
                    height={193}
                    className="w-full object-cover h-full"
                  />
                </Link>
                <Link
                             href={`/store/?category=${featuredCategory?._id}`}

                  className="cursor-pointer hover:text-yprimary font-bold text-[#202435] text-[14px] text-center line-clamp-1"
                >
                  {featuredCategory.name}
                </Link>
                {/* <p className="font-medium text-[#202435] text-[12px] text-center">
                  {featuredCategory.items || 0} items
                </p> */}
              </div>
            )}

            {/* Remaining Categories */}
            <div className="grid grid-cols-2 lg:grid-cols-4">
              {remainingCategories.map((category, index) => (
                <div
                  key={index}
                  className="border-[1.5px] p-4 flex md:flex-row flex-col gap-5 items-center"
                >
                  <Link             href={`/store/?category=${category?._id}`} className="w-[70px] h-[70px]">
                    <Image
                      src={category.image}
                      alt={category.name}
                      width={70}
                      height={70}
                      className="w-full object-cover h-full"
                    />
                  </Link>
                  <div className="space-y-2">
                    <Link
                                  href={`/store/?category=${category?._id}`}

                      className="cursor-pointer hover:text-yprimary font-bold text-[#202435] text-[14px] line-clamp-1 text-center lg:text-left w-full lg:line-clamp-2"
                    >
                      {category.name}
                    </Link>
                    {/* <p className="font-medium text-[#202435] text-[12px] text-center lg:text-left">
                      {category.items || 0} items
                    </p> */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
