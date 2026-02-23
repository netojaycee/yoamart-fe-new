import ContactForm from "@/components/local/ContactForm";
import React from "react";

export default function page() {
  return (
    <div className="px-2 md:px-10 text-gray-800">
      {/* <!-- Get In Touch Section --> */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Get In Touch
          </h2>
          <p className="text-gray-600 mt-4">
            Have questions or need assistance? We&apos;re here to help! Feel
            free to reach out to us through any of the following methods, and
            our team will respond as soon as possible.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {/* <!-- Address Card --> */}
            <div className="p-6 bg-gray-200 rounded-md shadow-md text-center">
              <div className="text-blue-500 text-4xl mb-4">📍</div>
              <h3 className="text-lg font-semibold">
                {" "}
                Femi Odutayo, Eyita Ojokoro North, Ikorodu 104231, Lagos
              </h3>
              <p className="text-gray-600">
                Visit us at our office for in-person assistance. We&apos;re
                located in the heart of the city, with easy access and parking.
              </p>
            </div>
            {/* <!-- Phone Card --> */}
            <div className="p-6 bg-gray-200 rounded-md shadow-md text-center">
              <div className="text-blue-500 text-4xl mb-4">📞</div>
              <h3 className="text-lg font-semibold">
                <a href="tel:+2348179752333">+2348179752333</a>
              </h3>
              <p className="text-gray-600">
                Call us for quick support or inquiries. Our customer service
                team is available Monday to Friday from 9 AM to 6 PM.
              </p>
            </div>
            {/* <!-- Email Card --> */}
            <div className="p-6 bg-gray-200 rounded-md shadow-md text-center">
              <div className="text-blue-500 text-4xl mb-4">✉️</div>
              <h3 className="text-lg font-semibold">
                yoasupermarket@gmail.com
              </h3>
              <p className="text-gray-600">
                Send us an email for any questions or support requests. We
                strive to respond within 24 hours on business days.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* <!-- Send Us Section --> */}
      <section className="py-12 bg-white shadow-md mb-10 rounded-lg">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center">
            Send Us
          </h2>
          <p className="text-gray-600 mt-4 text-center">
            Have questions or need assistance? We&appos;re here to help! Fill
            out the form below, and our team will get back to you as soon as
            possible.
          </p>

          <ContactForm />
        </div>
      </section>
    </div>
  );
}
