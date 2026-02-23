import React from "react";
import HeaderNavDesktop from "./header/HeaderNavDesktop";
import HeaderMain from "./header/HeaderMain";

export default function Header() {
  return (
    <>
      <HeaderNavDesktop />
      <HeaderMain />

      {/* last section links to main pages only on desktop */}
    </>
  );
}
