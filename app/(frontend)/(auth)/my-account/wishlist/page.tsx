"use client";
import React from "react";
import { MdCancel } from "react-icons/md";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FaCartPlus } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { FavoritesState, Product } from "@/lib/types";
import { removeFromFavorites } from "@/redux/slices/favoriteSlice";
import { addToCart } from "@/redux/slices/cartSlice";

export default function Wishlist() {
  const dispatch = useDispatch();
  const router = useRouter();

  const favoriteItems: Product[] = useSelector(
    (state: FavoritesState) => state.favorites.favoriteItems
  );

  const handleToggleFavorite = (data: Product) => {
    dispatch(removeFromFavorites(data));
  };

  const handleAddToCart = (datas: Product) => {
    dispatch(addToCart({ datas, router }));
  };

  if (favoriteItems.length < 1) {
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
          Your Wishlist is Empty
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Looks like you haven&apos;t added any items to your wishlist yet.
          Start browsing our products and add them to your wishlist.
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

  return (
    <div className="px-2 md:px-10">
      {" "}
      <h1 className="text-2xl font-bold mb-4">Default Wishlist</h1>
      {/* Wishlist Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200 text-sm md:text-base">
          <thead className="bg-gray-100">
            <tr>
              {/* <th className="p-2 md:p-4 border border-gray-200 text-left">
                Select
              </th> */}
              <th className="p-2 md:p-4 border border-gray-200 text-left"></th>
              <th className="p-2 md:p-4 border border-gray-200 text-left">
                Product Name
              </th>
              <th className="p-2 md:p-4 border border-gray-200 text-left">
                Unit Price
              </th>
              <th className="p-2 md:p-4 border border-gray-200 text-left hidden md:table-cell">
                Date Added
              </th>
              <th className="p-2 md:p-4 border border-gray-200 text-left">
                Stock Status
              </th>
              <th className="p-2 md:p-4 border border-gray-200 text-left"></th>
            </tr>
          </thead>
          <tbody>
            {favoriteItems.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50">
                {/* <td className="p-2 md:p-4 border border-gray-200 text-center">
                  <input type="checkbox" className="h-4 w-4" />
                </td> */}
                <td className="p-2 md:p-4 border border-gray-200 text-center">
                  <MdCancel
                    onClick={() => handleToggleFavorite(item)}
                    className="text-red-500 w-6 h-6 cursor-pointer"
                    title="Remove item"
                  />
                </td>
                <td className="p-2 md:p-4 border border-gray-200 ">
                  <Link href={`/store/${item?._id}`} className="flex gap-4 ">
                    <Image
                      src={item?.image[0]}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="w-16 h-16 object-cover rounded-md bg-gray-400"
                    />
                    <span className="line-clamp-3">{item.name}</span>
                  </Link>
                </td>
                <td className="p-2 md:p-4 border border-gray-200">
                  <span>
                    {new Intl.NumberFormat("en-NG", {
                      style: "currency",
                      currency: "NGN",
                    }).format(item?.price)}
                  </span>
                </td>
                <td className="p-2 md:p-4 border border-gray-200 hidden md:table-cell text-sm">
                  <td className="p-2 md:p-4 border border-gray-200 hidden md:table-cell text-sm">
                    {item?.createdAt
                      ? new Intl.DateTimeFormat("en-US", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }).format(new Date(item?.createdAt))
                      : "N/A"}{" "}
                  </td>{" "}
                </td>
                <td className="p-2 md:p-4 border border-gray-200">
                  <span
                    className={`text-xs md:text-sm ${
                      item.inStock ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {item.inStock ? "In stock" : "out of stock"}
                  </span>
                </td>
                <td className="p-2 md:p-4 border border-gray-200 text-center">
                  <Button
                    onClick={() => handleAddToCart(item)}
                    className="flex items-center gap-2 bg-ysecondary text-white px-4 py-2 rounded hover:bg-ysecondary/50"
                  >
                    <span className="hidden lg:block">Add to Cart</span>
                    <span className="lg:hidden">
                      <FaCartPlus className="" />
                    </span>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Bulk Actions */}
      {/* <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
        <div className="flex items-center gap-5">
          <select className="border border-gray-300 rounded px-4 py-2">
            <option value="">Actions</option>
            <option value="delete">Delete Selected</option>
            <option value="add_to_cart">Add Selected to Cart</option>
          </select>

          <Button className="flex items-center gap-2 bg-ysecondary text-white px-4 py-2 rounded hover:bg-ysecondary/50">
            <span>Apply Action</span>
          </Button>
        </div>
        <div className="flex gap-4">
          <Button className="bg-ysecondary text-white px-4 py-2 rounded hover:bg-ysecondary/50">
            Add Selected to Cart
          </Button>
          <Button className="bg-ysecondary text-white px-4 py-2 rounded hover:bg-ysecondary/50">
            Add All to Cart
          </Button>
        </div>
      </div> */}
    </div>
  );
}
