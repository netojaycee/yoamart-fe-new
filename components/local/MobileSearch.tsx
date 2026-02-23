"use client";

import * as React from "react";
import { Search } from "lucide-react";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import SearchBar from "./SearchBar";

export function MobileSearch() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <DrawerClose>
          <Search className="w-7 h-7" />
        </DrawerClose>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle></DrawerTitle>
          </DrawerHeader>
          <div className="p-2 pb-0">
            <SearchBar />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
