import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-200 dark:border-gray-800">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="space-y-8 text-gray-500 dark:text-gray-400">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                1. Information We Collect
              </h2>
              <p className="mb-4">
                We collect information you provide directly to us when using the
                Campus Lost & Found platform. This includes:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Account information: Name, email address, and authentication
                  data.
                </li>
                <li>
                  Report information: Descriptions of lost/found items, location
                  data, and context you provide.
                </li>
                <li>
                  Communications: Messages sent through the platform to other
                  users.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                2. How We Use Your Information
              </h2>
              <p className="mb-4">We use the information we collect to:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Provide, maintain, and improve the Campus Lost & Found
                  platform.
                </li>
                <li>Facilitate the matching and return of lost items.</li>
                <li>Communicate with you regarding our services.</li>
                <li>
                  Ensure the security and safety of our platform and users.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                3. Information Sharing
              </h2>
              <p>
                When you create a report or send a message, certain information
                (like your name or contact details) may be shared with other
                users to facilitate the return of an item. We do not sell your
                personal information to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                4. Data Security
              </h2>
              <p>
                We take reasonable measures to help protect your personal
                information from loss, theft, misuse, unauthorized access,
                disclosure, alteration, and destruction.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                5. Contact Us
              </h2>
              <p>
                If you have any questions about this Privacy Policy, please
                contact us at kspramath.ec25@bmsce.ac.in.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
