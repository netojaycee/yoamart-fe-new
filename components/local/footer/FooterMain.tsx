
import { shuffleArray } from "@/hooks/shuffle";
import { Category, Product } from "@/lib/types";
import { useGetAllCategoryQuery, useGetAllProductQuery } from "@/redux/appData";
import { Currency, Milk, Tags, Truck } from "lucide-react";
import React from "react";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"; // Import Tooltip components

export default function FooterMain() {
  const { data: categoryData, isLoading: categoryLoading } =
    useGetAllCategoryQuery(undefined);
  const { data: productData, isLoading: productLoading } =
    useGetAllProductQuery({ page: 1, limit: 600 });

  if (categoryLoading || productLoading) {
    return;
  }

  const categories: Category[] = shuffleArray([...(categoryData && categoryData.category) || []]).slice(0, 8);
  const products: Product[] = (productData && productData.products) || [];
  
  const getRandomProductsByCategory = (categoryId: string): Product[] => {
    const filteredProducts = products.filter(
      (product) => product?.categoryId?._id === categoryId
    );
    return shuffleArray([...filteredProducts]).slice(0, 4);
  };

  return (
    <footer className="bg-[#F7F8FD] text-gray-800 py-8">
      {/* Features Section */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 grid-cols-1 items-start text-black justify-center gap-6 md:gap-7 px-5 md:px-20 py-4 md:py-8 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Milk className="w-6 h-6" />
          <p className="font-medium text-[13px]">
            Quality you can trust, every day.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Truck className="w-6 h-6" />
          <p className="font-medium text-[13px]">Reliable delivery.</p>
        </div>
        <div className="flex items-center gap-2">
          <Tags className="w-6 h-6" />
          <p className="font-medium text-[13px]">
            Exclusive deals and offers daily.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Currency className="w-6 h-6" />
          <p className="font-medium text-[13px]">
            Unbeatable value, every time.
          </p>
        </div>
      </div>

      {/* Categories Section */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-10 px-5 md:px-10 py-8">
        {categories.map((category) => {
          const randomProducts = getRandomProductsByCategory(category._id);
          return (
            <div key={category._id}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <h4 className="font-semibold text-[15px] mb-4 font-dosis text-[#202435] line-clamp-1">
                      {category.name.toUpperCase()}
                    </h4>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{category.name}</p> {/* Full category name */}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <ul className="space-y-2 text-sm text-[#71778e]">
                {randomProducts.map((product) => (
                  <TooltipProvider key={product._id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <li className="line-clamp-1 hover:text-yprimary cursor-pointer">
                          <Link href={`/store/${product._id}`}>
                            {product.name}{" "}
                          </Link>
                        </li>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{product.name}</p> {/* Full product name */}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </footer>
  );
}
