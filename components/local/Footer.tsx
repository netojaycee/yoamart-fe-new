import React from "react";
import NewsLetter from "./footer/NewsLetter";
import FooterMain from "./footer/FooterMain";
import FooterBottom from "./footer/FooterBottom";

export default function Footer() {
  return (
    <div className="">
      <NewsLetter />
      <FooterMain />
      <FooterBottom />
    </div>
  );
}
