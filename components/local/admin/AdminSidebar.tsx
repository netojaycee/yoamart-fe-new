"use client";

import * as React from "react";
import {
  BookOpen,
  SquareTerminal,
  LayoutDashboard,
  ChartBarStacked,
  ShoppingBasket,
  UserRoundPlus,
  Bike,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "./NavMain";
import { NavUser } from "./NavUser";
import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/types";

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const session = useSelector((state: RootState) => state.auth.userData);
  // const superAdmin = session?.email === "yoasupermarket@gmail.com";
  const data = {
    user: {
      name: session?.name || "yoamart admin",
      email: session?.email || "",
      avatar: "/avatars/shadcn.jpg",
    },

    navMain: [
      {
        title: "Dashboard",
        url: "/admin/dashboard",
        icon: LayoutDashboard,
        collapsible: false,
      },
      {
        title: "Catalog",
        url: "#",
        icon: SquareTerminal,
        isActive: true,
        collapsible: true,

        items: [
          {
            title: "Products",
            url: "/admin/all-products",
            icon: ShoppingBasket,
          },

          {
            title: "Categories",
            url: "/admin/all-categories",
            icon: ChartBarStacked,
          },
        ],
      },
      {
        title: "Orders",
        url: "/admin/orders",
        collapsible: false,
        icon: BookOpen,
      },
      // {
      //   title: "Customers",
      //   url: "/admin/customers",
      //   icon: Bot,
      // },

      // ...(superAdmin
      //   ? [
      //       {
      //         title: "Create Admin",
      //         url: "/admin/create-admin",
      //         collapsible: false,
      //         icon: UserRoundPlus,
      //       },
      //     ]
      //   : []),

      {
        title: "Drivers",
        url: "/admin/all-drivers",
        collapsible: false,
        icon: Bike,
      },

      {
        title: "Create Admin",
        url: "/admin/create-admin",
        collapsible: false,
        icon: UserRoundPlus,
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex items-center justify-center flex-row">
        {" "}
        <div className="flex aspect-square size-8 items-center justify-center rounded-lg  text-sidebar-primary-foreground">
          {/* <SquareTerminal className="size-4" /> */}
          <Image
            className="size-7"
            width={164}
            height={44}
            src="/images/logo-icon.png"
            alt="yoamart logo"
          />
        </div>
        <Link href="/admin/dashboard" className="">
          <Image
            className="object-coover w-full h-full"
            width={164}
            height={44}
            src="/images/760--203YOA@3x.png"
            alt="yoamart logo"
          />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
