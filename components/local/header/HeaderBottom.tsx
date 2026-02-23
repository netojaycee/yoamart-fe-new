"use client";
import { Button } from "@/components/ui/button";
// import { shuffleArray } from "@/hooks/shuffle";
import { Category } from "@/lib/types";
import { useGetAllCategoryQuery } from "@/redux/appData";
import { Box, ChevronDown, Menu } from "lucide-react";
import Link from "next/link";
// import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { categoryIcons, CategoryNames } from "../CategoryIcons";

export default function HeaderBottom() {
  // const pathname = usePathname();
  // const isHome = pathname === "/";
  const [showCategories, setShowCategories] = useState<boolean>(false);
  let hideMenuTimeout: NodeJS.Timeout;
  
  const handleMouseEnter = () => {
    clearTimeout(hideMenuTimeout); // Cancel any pending hide action
    setShowCategories(true);
  };
  
  const handleMouseLeave = () => {
    hideMenuTimeout = setTimeout(() => {
      setShowCategories(false);
    }, 300); // Adjust delay time as needed
  };
  
  const { data } = useGetAllCategoryQuery(undefined);
  const category: Category[] = data ? data.category : [];

  // const shuffledData: Category[] = shuffleArray([...category]);

  return (
    <div className="hidden lg:flex items-center">
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative z-10"
      >
        <Button className="bg-ysecondary text-white flex items-center gap-2 p-6 hover:bg-ysecondary rounded-[30px]">
          <Menu className="w-5 h-5" />
          <p className="text-[16px] font-semibold font-dosis uppercase">
            All Categories
          </p>
          <ChevronDown
            className={`w-5 h-5 ${
              showCategories ? "transform transition-transform rotate-180" : ""
            }`}
          />
        </Button>
        {/* <div className="font-dosis absolute left-1/2 transform -translate-x-1/2 -bottom-2 uppercase text-[#71778e] bg-gray-200 text-center rounded-md text-[10px] px-2">
          Total 65 products
        </div> */}
        {showCategories && (
          // <div className="rounded-b-lg absolute top-full mt-2 left-0 w-[270px] py-6 px-8 bg-white border border-gray-300 shadow-lg">
          //   <ul className="space-y-5">
          //     {category.slice(0, 9).map((categories, index) => (
          //       <li key={index}>
          //         <Link
          //           href={`/store/?category=${categories?._id}`}
          //           className="flex items-center gap-3  text-[#3e445a]  hover:text-ysecondary "
          //         >
          //           <Box className="w-5 h-5" />
          //           <p className="text-sm">{categories?.name}</p>
          //         </Link>
          //       </li>
          //     ))}
          //   </ul>
          // </div>

          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="rounded-lg absolute top-full mt-2 left-0 w-[270px] py-4 px-6 bg-white border border-gray-300 shadow-lg shadow-gray-200 z-10"
          >
            <ul className="space-y-2">
              {category.slice(0, 9).map((categories, index) => (
                <li key={index}>
                  <Link
                    href={`/store/?category=${categories?._id}`}
                    className="flex items-center gap-3 text-[#3e445a] group hover:text-white hover:bg-ysecondary rounded-lg py-2 px-4 transition-all duration-200 ease-in-out"
                  >
                    {/* Add an icon (using Box or replace with any other icon) */}
                    {categoryIcons[categories?.name as CategoryNames] || (
                      <Box className="w-5 h-5 text-ysecondary group-hover:text-white" />
                    )}

                    <p className="text-sm font-medium line-clamp-1">
                      {categories?.name}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex items-center justify-end w-full gap-4">
        <Link
          href="/"
          className="font-dosis uppercase hover:bg-ysecondary text-[#3e445a] hover:bg-opacity-10 font-semibold hover:text-ysecondary  rounded-[30px] hover:px-3 py-2"
        >
          Home
        </Link>
        <Link
          href="/store"
          className="font-dosis uppercase hover:bg-ysecondary text-[#3e445a] hover:bg-opacity-10 font-semibold hover:text-ysecondary  rounded-[30px] hover:px-3 py-2"
        >
          Products
        </Link>

        {category.slice(0, 3).map((categories, index) => (
          <Link
            key={index}
            href={`/store/?category=${categories?._id}`}
            className="flex items-center gap-2 font-dosis uppercase hover:bg-ysecondary text-[#3e445a] hover:bg-opacity-10 font-semibold hover:text-ysecondary  rounded-[30px] hover:px-3 py-2"
          >
            {categoryIcons[categories?.name as CategoryNames] || (
              <Box className="w-5 h-5 text-ysecondary" />
            )}{" "}
            <p className="">{categories?.name}</p>
          </Link>
        ))}

        <Link
          href="/contact"
          className="font-dosis uppercase hover:bg-ysecondary text-[#3e445a] hover:bg-opacity-10 font-semibold hover:text-ysecondary  rounded-[30px] hover:px-3 py-2"
        >
          Contact
        </Link>
      </div>
    </div>
  );
}
