"use client";

import Banner1 from "./components/Banner1";
import Banner2 from "./components/Banner2";
import Banner3 from "./components/Banner3";
import BestSellers from "./components/BestSellers";
import Categories from "./components/Categories";
import Hero from "./components/Hero";
import HotProduct from "./components/HotProduct";
import LeftColumn from "./components/LeftColumn";
import NewProducts from "./components/NewProducts";

// import { ToastAction } from "@/components/ui/toast";
// import { useToast } from "@/hooks/use-toast";

export default function Home() {
  // const { toast } = useToast();
  return (
    <div className="space-y-5">
      {/* <main className="">
        <Button
          onClick={() => {
            toast({
              title: "Scheduled: Catch up",
              description: "Friday, February 10, 2023 at 5:57 PM",
              action: (
                <ToastAction
                  onClick={() => alert("Undo")}
                  altText="Goto schedule to undo"
                >
                  Undo
                </ToastAction>
              ),
            });
          }}
        >
          Show Toast
        </Button>

        
      </main> */}

      <Hero />
      <div className="px-2 lg:px-10 flex gap-5 w-full">
        {/* Left Section */}
        <div className="min-h-20 hidden md:block md:w-[320px]">
          <LeftColumn />
        </div>

        {/* Main Section */}
        <div className="w-full md:w-[calc(100vw-320px)] flex flex-col gap-5">
          <BestSellers />
          <Banner1 />
          <HotProduct />
          <Banner2 />
          <NewProducts />
          <Banner3 />

          <div className="md:hidden">
            <LeftColumn />
          </div>
        </div>
      </div>
      <Categories />
    </div>
  );
}
