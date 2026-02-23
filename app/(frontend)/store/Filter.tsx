import CustomLoader from "@/components/local/CustomLoader";
import { MobileFilterSidebarProps } from "@/components/local/MobileFilterSidebar";
import MultiRangeSlider from "@/components/local/PriceRange/MultiRangeSlider";
// import Image from "next/image";
import React from "react";

export default function Filter({
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
    <div className="space-y-10">
      {" "}
      <div className="">
        <h2 className="uppercase font-dosis text-[18px] text-[#202045] font-semibold mb-3">
          Product categories
        </h2>
        <div className="space-y-3">
          {isLoading ? (
            <div className="min-h-20 flex items-center justify-center">
              <CustomLoader />
            </div>
          ) : (
            category.map((cat, index) => (
              <div key={index} className="space-x-2 flex items-center">
                <input
                  type="checkbox"
                  className="h-3 w-3"
                  checked={selectedCategory.includes(cat._id)}
                  onChange={() => onCategoryChange(cat._id)}
                />
                <p className="text-sm text-[#7e7e7e]">{cat.name}</p>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="">
        <h2 className="uppercase font-dosis text-[18px] text-[#202045] font-semibold mb-3">
          Filter by price
        </h2>
        <div className="space-y-3">
          <div className="space-x-2 flex items-center">
            <MultiRangeSlider
              min={range[0]}
              max={highestPrice}
              onFilter={handleFilter}
            />
          </div>
        </div>
      </div>
      <div className="">
        <h2 className="uppercase font-dosis text-[18px] text-[#202045] font-semibold mb-3">
          product status
        </h2>
        <div className="space-y-3 flex flex-col">
          <div className="space-x-2 flex items-center">
            <input
              type="checkbox"
              className="h-3 w-3"
              onChange={() => onStockChange("inStock")}
            />
            <p className="text-sm text-[#7e7e7e]">In stock</p>
          </div>
          <div className="space-x-3 flex items-center">
            <input
              type="checkbox"
              className="h-3 w-3"
              onChange={() => onStockChange("outOfStock")}
            />
            <p className="text-sm text-[#7e7e7e]">out of stock</p>
          </div>
        </div>
      </div>
      {/* <div className="">
        <Image
          src="/images/sidebar-banner.gif"
          alt="banner"
          width={600}
          height={230}
          className="w-full h-full object-cover  "
        />{" "}
      </div> */}
    </div>
  );
}
