"use client";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { FilterIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Filter from "@/app/(frontend)/store/Filter";
import { Category } from "@/lib/types";

export interface MobileFilterSidebarProps {
  category: Category[]; // An array of categories
  range: [number, number]; // A tuple with min and max price range
  highestPrice: number; // The maximum price value
  handleFilter: (range: { min: number; max: number }) => void; // A function to handle filtering
  isLoading: boolean;
}

export function MobileFilterSidebar({
  category,
  range,
  highestPrice,
  handleFilter,
  isLoading,
  onStockChange, // Added prop for stock change
  onCategoryChange,
  selectedCategory,
}: MobileFilterSidebarProps & { selectedCategory: string[] } & {
  onStockChange: (status: string) => void;
} & {
  onCategoryChange: (status: string) => void;
}) {
  return (
    <Sheet>
      <SheetTrigger>
        <p className="cursor-pointer flex gap-2 items-center">
          Filter Products <FilterIcon className="w-4 h-4" />
        </p>
      </SheetTrigger>
      <SheetContent className="z-[9999] overflow-y-auto h-screen" side={"left"}>
        <SheetHeader>
          <SheetTitle></SheetTitle>
          <SheetClose asChild>
            <Link href="/" className="w-[164px] h-[44px] ">
              <Image
                className="object-cover w-full h-full"
                width={164}
                height={44}
                src="/images/539--133YOA@3x.png"
                alt="yoamart logo"
              />
            </Link>
          </SheetClose>
        </SheetHeader>
        <div className="grid gap-4 py-4 mt-3">
          <Filter
            category={category}
            handleFilter={handleFilter}
            highestPrice={highestPrice}
            range={range}
            isLoading={isLoading}
            onStockChange={onStockChange} // Added prop for stock change
            onCategoryChange={onCategoryChange}
            selectedCategory={selectedCategory}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
