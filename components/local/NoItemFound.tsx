import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";

export default function NoItemFound({title1, title2}: {title1: string, title2: string}) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Image
        src={"/images/error.png"}
        alt="Empty Wishlist"
        width={200} // Adjust the width as needed
        height={200} // Adjust the height as needed
        className="mb-6"
      />
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        {title1}
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        {title2}
      </p>
      <Button
        onClick={() => (window.location.href = "/store")} // Redirect to the store page
        className="bg-ysecondary text-white px-6 py-2 rounded hover:bg-primary/80"
      >
        Browse Products
      </Button>
    </div>
  );
}
