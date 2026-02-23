import Image from "next/image";
import React from "react";

export default function Banner1() {
  return (
    <div className="flex flex-col md:flex-row w-full md:h-[180px] rounded-lg overflow-hidden shadow-md bg-[#F8EFEA] justify-between">
      <div className="space-y-1 p-8">
        <h4 className="font-normal text-[14px] text-[#9b9bb4] text-center md:text-left">
          Shop with Comfort
        </h4>
        <h3 className="text-[18px] font-semibold text-[#71778e] text-center md:text-left">
          Bringing you a seamless shopping experience for every need—online or
          in-store.
        </h3>
      </div>
      {/* Background Image */}
      <div className="w-[300px] mx-auto">
        <Image
          // src={
          //   "https://klbtheme.com/bacola/wp-content/plugins/bacola-core/elementor/images/banner-box2.jpg"
          // }

          src="/images/349x232_3x-removebg-preview.png"
          alt="banner1"
          width={349}
          height={232}
          className="w-full object-fit  h-full object-center"
        />
      </div>
    </div>
  );
}
