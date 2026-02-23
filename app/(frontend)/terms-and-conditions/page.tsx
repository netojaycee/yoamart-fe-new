import Link from "next/link";
import React from "react";

export default function TermsAndConditions() {
  return (
    <div className="px-2 md:px-10 text-gray-800">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Our Terms & Conditions
      </h1>
      <p className="text-gray-700 leading-relaxed mb-4">
        Welcome to YOA SUPERMARKET! These terms and conditions outline the rules
        and regulations for the use of our services. By accessing and using our
        website, you agree to comply with and be bound by these terms.
      </p>

      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        1. Acceptance of Terms
      </h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        By using this website, you agree to be bound by these Terms &
        Conditions. If you disagree with any part of the terms, you must not use
        our website or services.
      </p>

      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        2. Changes to Terms
      </h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        We reserve the right to modify or update these terms at any time. We
        will notify users of any changes through the website or by email.
        Continued use of the site after such updates will constitute your
        acceptance of the modified terms.
      </p>

      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        3. Use of the Website
      </h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        You agree to use our website for lawful purposes only. You may not
        engage in any activity that violates applicable laws or infringes on the
        rights of others.
      </p>

      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        4. Account Registration
      </h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        To access certain features of the website, you may be required to create
        an account. You are responsible for maintaining the confidentiality of
        your account credentials and are liable for any activities that occur
        under your account.
      </p>

      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        5. Privacy Policy
      </h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        Your privacy is important to us. Please refer to our Privacy Policy to
        understand how we collect, use, and protect your personal information.
      </p>

      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        6. Intellectual Property
      </h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        All content, including text, images, logos, and trademarks, are the
        property of YOA SUPERMARKET or its licensors. You may not use any of our
        intellectual property without prior written permission.
      </p>

      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        7. Limitation of Liability
      </h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        YOA SUPERMARKET will not be held liable for any direct, indirect,
        incidental, or consequential damages arising from your use of the
        website or services.
      </p>

      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        8. Termination
      </h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        We reserve the right to suspend or terminate your access to our website
        or services if you violate these terms or engage in inappropriate
        behavior.
      </p>

      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        9. Governing Law
      </h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        These Terms & Conditions will be governed by and construed in accordance
        with the laws of Nigeria, without regard to its conflict of law
        principles.
      </p>

      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        10. Contact Us
      </h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        If you have any questions or concerns regarding these Terms &
        Conditions, please contact us <Link className="text-blue-500 underline" href="/contact">here</Link>.
      </p>
    </div>
  );
}
