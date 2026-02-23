import Image from "next/image";
import React from "react";

export default function Hero() {
  return (
    <div className="px-2 lg:px-10 flex gap-5 w-full py-5">
      {/* Left Section */}
      <div className="relative lg:w-[23%] h-[229px] md:h-[350px] rounded-lg overflow-hidden shadow-md hidden lg:block">
        {/* Background Image */}

        <div className="relative h-full ">
          {" "}
          <Image
            src="/images/table-water.jpg"
            alt="slider"
            width={270}
            height={403}
            className="w-full object-cover h-full rounded-lg object-bottom "
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        {/* Text Content */}
        <div className="top-6 absolute right-3 text-right">
          <p className="text-sm text-gray-200">Refresh Your Senses</p>
          <h2 className="text-xl font-light text-gray-200">Pure & Crisp</h2>
          <h1 className="text-2xl font-bold text-gray-200">
            Premium Table Water
          </h1>
          {/* <p className="text-sm text-gray-200 mt-2">starting-at</p>
          <p className="text-2xl font-bold text-red-400">
            {new Intl.NumberFormat("en-NG", {
              style: "currency",
              currency: "NGN",
            }).format(150)}
          </p> */}
        </div>
      </div>

      {/* Main Section */}
      <div className="relative w-full lg:w-[77%] md:h-[365px] lg:pl-3">
        <div className="relative h-full ">
          <Image
            // src={
            //   "https://klbtheme.com/bacola/wp-content/uploads/2021/04/slider-image-1.jpg"
            // }
            src="/images/hero.jpg"
            alt="slider"
            width={420}
            height={229}
            className="w-full object-cover h-full  rounded-lg filter brightness-75 blur-[0.2px]"
          />
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        <div className="absolute top-[100px] md:top-40 left-4 md:left-8 transform -translate-y-1/2 space-y-1 md:space-y-2 max-w-lg">
          <p className="text-xs md:text-sm text-white opacity-80 tracking-wide">
            Yoamart Supermart
          </p>
          <h2 className="text-lg md:text-2xl font-light text-white opacity-90">
            One-Stop Shop for All Your Needs
          </h2>
          <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight">
            Health, Beauty, Home Essentials, and More!{" "}
          </h1>
          <p className="text-sm md:text-base text-white mt-2 opacity-80">
            Explore Regular Discounts
          </p>
          <p className="text-xl md:text-3xl font-bold text-yprimary">
            Shop Now & Save Big!
          </p>
        </div>
      </div>
    </div>
  );
}
