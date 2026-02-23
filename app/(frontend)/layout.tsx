"use client";
import BottomNavMobile from "@/components/local/BottomNavMobile";
import Footer from "@/components/local/Footer";
import Header from "@/components/local/Header";
import HeaderAnnouncement from "@/components/local/header/HeaderAnnouncement";
// import { CustomBreadcrumb } from "@/components/local/header/CustomBreadcrumb";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isProductDetails = /^\/store\/[^/]+/.test(pathname);
  const isContactOrAboutUs =
    pathname === "/contact" || pathname === "/about-us";

  return (
    <>
      {" "}
      <HeaderAnnouncement />
      <Header />
      <div className="max-w-7xl mx-auto">
        

        <div
          className={` ${
            (isContactOrAboutUs || isProductDetails) && "bg-[#f7f8fd]"
          }`}
        >
          {!isHome && (
            <div className="px-2 md:px-10 py-5">
              {/* <CustomBreadcrumb /> */}
            </div>
          )}
          {children}
        </div>
        <BottomNavMobile />
      </div>
      <Footer />
    </>
  );
}
