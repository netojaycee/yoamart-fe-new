import { Product } from "@/lib/types";
import Image from "next/image";
// import Link from "next/link";
import React from "react";

export default function SearchResultItem({
  searchResult,
}: {
  searchResult: Product;
}) {
  return (
    <li className="grid grid-cols-2 items-center p-2 border-b last:border-none">
      <div className="flex gap-2 items-center ">
        <div className="border rounded-md w-[41px] h-[41px]">
          <Image
            src={searchResult.image[0]}
            alt=""
            width={90}
            height={90}
            className="w-full h-full object-contain object-center"
          />
        </div>
        <a
          href={`/store/${searchResult._id}`}
          className="line-clamp-1 overflow-hidden text-[14px] font-medium hover:underline"
        >
          {searchResult.name}{" "}
        </a>
      </div>
      <div className="flex justify-end">
        <p className="text-[#D51243] font-dosis text-[15px] font-semibold">
          {new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
          }).format(searchResult.price)}
        </p>
      </div>
    </li>
  );
}
