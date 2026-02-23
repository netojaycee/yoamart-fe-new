import Link from "next/link";
import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="px-2 md:px-10 my-10">
      <h1 className="text-2xl font-semibold mb-4 text-gray-800">Who we are</h1>
      <p className="text-gray-700 leading-relaxed mb-4">
        Our website address is:{" "}
        <Link className="text-blue-500 underline" href="https://yoamart.com">
          yoamart.com
        </Link>
      </p>

      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Account Creation
      </h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        When you create an account on our website, we collect your personal
        information such as name, email address, phone number, and delivery
        address. This information is used to process your orders and provide you
        with a smooth shopping experience.
      </p>

      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Cart and Checkout
      </h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        As you add items to your cart, we store the product details and
        quantities to facilitate your checkout process. During checkout, we
        collect payment details necessary for processing your order. These
        details are securely handled by our payment processor.
      </p>

      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Cookies</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        We use cookies to enhance your shopping experience. These cookies help
        us remember your preferences and items added to the cart, so you can
        continue shopping easily.
      </p>

      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Embedded content from other websites
      </h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Our website may include embedded content such as product images and
        advertisements from third-party sites. These sites may collect data
        about you, including your interactions with the embedded content.
      </p>

      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Who we share your data with
      </h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        We do not share your personal information with third parties, except for
        processing payments or delivering your orders. Payment processors and
        delivery partners may have access to necessary data, but only for
        fulfilling your order.
      </p>

      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        How long we retain your data
      </h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        We retain your personal information for as long as necessary to process
        your orders, provide customer service, and comply with legal
        obligations. If you choose to delete your account, we will remove your
        personal data from our records.
      </p>

      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        What rights you have over your data
      </h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        If you have an account on this site, you can request to view, update, or
        delete your personal information. If you wish to exercise these rights,
        please contact us directly.
      </p>

      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Where we send your data
      </h2>
      <p className="text-gray-700 leading-relaxed">
        Visitor comments may be checked through an automated spam detection
        service. We do not send your data to third parties unless necessary for
        processing orders or complying with legal requests.
      </p>
    </div>
  );
}
