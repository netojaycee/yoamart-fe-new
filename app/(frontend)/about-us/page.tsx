import Image from "next/image";
import React from "react";

export default function AboutUs() {
  return (
    <div className="text-gray-800">
      {/* <!-- Hero Section --> */}
      <section className="relative w-full md:h-[350px] rounded-lg overflow-hidden shadow-lg">
        {/* Background Image */}
        <div className="relative">
          <Image
            src="/images/about-us.jpg"
            alt="banner"
            width={600}
            height={230}
            className="w-full h-full object-cover rounded-lg filter brightness-75 blur-[0.2px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>

        {/* Text Content */}
        <div className="absolute top-1/3 transform -translate-y-1/3 text-center -translate-x-1/2 left-1/2">
          <h2 className="text-lg md:text-[30px] font-medium text-white mb-2">
            About Us
          </h2>
          <h1 className="text-xl md:text-[40px] font-bold text-white">
            Welcome to Yoamart!
          </h1>
        </div>
      </section>

      {/* <!-- Content Section --> */}
      <div className="px-2 md:px-10 py-10 space-y-10">
        <p className="text-lg leading-7">
          At Yoamart, we believe in making online shopping easy, accessible, and
          enjoyable for everyone. Our mission is to provide a diverse range of
          high-quality products, tailored to suit the unique needs and
          preferences of our customers. We pride ourselves on offering top-notch
          customer service, fast shipping, and a secure shopping experience.
        </p>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          Our Story
        </h2>
        <p className="text-lg leading-7">
          Yoamart was founded with the goal of creating a marketplace that
          connects customers with the best products from around the world. We
          started as a small e-commerce platform but quickly grew to meet the
          needs of our growing customer base. Our team is passionate about
          curating a wide selection of items, from fashion and electronics to
          home essentials and beauty products, all in one convenient place.
        </p>
        <p className="text-lg leading-7">
          What started as a passion for bringing the best products to the market
          has grown into a thriving online destination for shoppers who value
          quality and convenience.
        </p>

        {/* <!-- Image and Text Section --> */}
        <div className="md:flex md:space-x-8 items-center">
          <div className="md:w-1/3">
            <Image
              width={400}
              height={600}
              src="/images/about.jpg"
              alt="Placeholder"
              className="rounded-md shadow-md bg-gray-300 min-h-[300px]"
            />
          </div>
          <div className="md:w-2/3 mt-6 md:mt-0 space-y-4">
            {/* <p className="text-lg font-semibold">Rachel Leonard - Bacola CEO</p> */}
            <h3 className="text-xl font-bold text-gray-900">Our Vision</h3>
            <p className="text-lg leading-7">
              Our vision is to be the go-to online retailer for people who value
              exceptional products and outstanding customer service. Whether
              you&apos;re shopping for the latest tech gadgets, trendy fashion
              pieces, or unique home decor, Yoamart aims to offer an extensive
              and diverse selection that suits every style and budget.
            </p>
          </div>
        </div>
        <h3 className="text-xl font-bold text-gray-900">Why Choose Yoamart?</h3>
        <ul className="list-disc list-inside space-y-2 text-lg leading-7">
          <li>
            <strong>Quality Products:</strong> We partner with trusted suppliers
            and brands to bring you top-quality products at competitive prices.
          </li>
          <li>
            <strong>Customer-Centric Service:</strong> Our customer support team
            is dedicated to ensuring your shopping experience is smooth and
            hassle-free.
          </li>
          <li>
            <strong>Fast and Reliable Shipping:</strong> We offer fast shipping
            options to ensure your orders reach you as quickly as possible.
          </li>
          <li>
            <strong>Secure Shopping Experience:</strong> We use the latest
            encryption technology to ensure your personal information and
            payment details are always secure.
          </li>
        </ul>
        <p className="text-lg leading-7">
          At Yoamart, we are committed to offering an inclusive shopping
          experience that caters to a wide range of needs and preferences. We
          are constantly updating our inventory, expanding our product
          offerings, and improving our services to ensure we meet the demands of
          our customers. Your satisfaction is our top priority, and we will
          continue to work hard to provide you with the best possible shopping
          experience.
        </p>
        <p className="text-lg leading-7">
          Thank you for choosing Yoamart. We look forward to serving you!
        </p>
      </div>
    </div>
  );
}
