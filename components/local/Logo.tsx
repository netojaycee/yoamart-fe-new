import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Logo() {
  return (
    <Link
      href="/"
      className="flex flex-col gap-[2px] w-[99px] h-[22px]  md:w-[164px] md:h-[44px] "
    >
      <Image
        className="object-cover w-full h-full md:hidden"
        width={77}
        height={19}
        src="/images/539--133YOA@3x.png"
        alt="yoamart logo"
      />
      <Image
        className="object-cover  hidden lg:hidden md:block"
        width={100}
        height={44}
        src="/images/760--203YOA@3x.png"
        alt="yoamart logo"
      />
      <Image
        className="object-cover w-full h-full hidden lg:block"
        width={164}
        height={44}
        src="/images/760--203YOA@3x.png"
        alt="yoamart logo"
      />
      {/* <p className="text-[10px] opacity-50 md:block hidden">
        Online Grocery Shopping Center
      </p> */}
    </Link>
  );
}
