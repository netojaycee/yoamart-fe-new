"use client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { Box, ChevronDown, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import React from "react";
import { useGetAllCategoryQuery } from "@/redux/appData";
// import { shuffleArray } from "@/hooks/shuffle";
import { Category, RootState } from "@/lib/types";
import { categoryIcons, CategoryNames } from "../CategoryIcons";
import { useSelector } from "react-redux";

export function MobileSidebar() {
  const [isOpen, setIsOpen] = React.useState(false);

  const { data } = useGetAllCategoryQuery(undefined);
  const category: Category[] = data ? data.category : [];
  // const shuffledData: Category[] = shuffleArray([...category]);
  const session = useSelector((state: RootState) => state.auth.userData);


  return (
    <Sheet>
      <SheetTrigger asChild>
        <Menu className="w-7 h-7 cursor-pointer" />
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
          <Collapsible open={isOpen} onOpenChange={setIsOpen} className="">
            <CollapsibleTrigger asChild className="w-full">
              <Button className="bg-ysecondary text-white flex items-center gap-2 p-6 hover:bg-ysecondary justify-between w-full">
                <Menu className="w-5 h-5" />
                <p className="text-[16px] font-semibold font-dosis uppercase">
                  All Categories
                </p>
                <ChevronDown className={`w-5 h-5 `} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div>
                <ul className="space-y-6 mt-5">
                  {category.map((categories, index) => (
                    <li key={index}>
                      <SheetClose asChild>
                        <Link
                          href={`/store/?category=${categories?._id}`}
                          className="flex items-center gap-3 text-[#3e445a] hover:text-ysecondary"
                        >
                          {categoryIcons[categories?.name as CategoryNames] || (
                            <Box className="w-5 h-5 text-ysecondary group-hover:text-white" />
                          )}{" "}
                          <p className="text-sm">{categories?.name}</p>
                        </Link>
                      </SheetClose>
                    </li>
                  ))}
                </ul>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <p className="mt-5 text-gray-300">Site Navigation</p>
          <Separator className="" />
          <ul className="">
            <li className="py-3">
              <SheetClose asChild>
                <Link href="/" className="">
                  Home
                </Link>
              </SheetClose>
            </li>
            <Separator className="" />

            <li className="py-3">
              <SheetClose asChild>
                <Link href="/store" className="">
                  Products
                </Link>
              </SheetClose>
            </li>
            <Separator className="" />
{/* 
            {shuffledData.slice(0, 3).map((data, index) => (
              <div key={index}>
                <li className="py-3">
                  <SheetClose asChild>
                    <Link
                      href={`/store/?category=${data?._id}`}
                      className="flex items-center gap-3 text-[#3e445a] hover:text-ysecondary"
                    >
                      {categoryIcons[data?.name as CategoryNames] || (
                        <Box className="w-5 h-5 text-ysecondary group-hover:text-white" />
                      )}{" "}
                      <p className="text-sm">{data?.name}</p>
                    </Link>
                  </SheetClose>
                </li>
                <Separator className="" />
              </div>
            ))} */}

            <li className="py-3">
              <SheetClose asChild>
                <Link href="/contact" className="">
                  Contact
                </Link>
              </SheetClose>
            </li>
            <li className="py-3">
              <SheetClose asChild>
                <Link href="/about-us" className="">
                  About us
                </Link>
              </SheetClose>
            </li>
            <Separator className="" />
            {session && session?.role === "admin" && (
              <>
                <li className="py-3">
                  <SheetClose asChild>
                    <Link href={"/admin/dashboard"} className="">
                      Admin
                    </Link>
                  </SheetClose>
                </li>
                <Separator className="" />
              </>
            )}
          </ul>
        </div>
      </SheetContent>
    </Sheet>
  );
}
