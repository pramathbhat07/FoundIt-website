import React from "react";

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-200 dark:border-gray-800">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
            Cookie Policy
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="space-y-8 text-gray-500 dark:text-gray-400">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                1. What Are Cookies
              </h2>
              <p>
                Cookies are small text files that are placed on your computer or
                mobile device when you visit our website. They are widely used
                to make websites work more efficiently and provide a better user
                experience.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                2. How We Use Cookies
              </h2>
              <p className="mb-4">
                Campus Lost & Found uses cookies for the following purposes:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Essential Cookies:</strong> Required for the operation
                  of our platform, such as authenticating users and preventing
                  fraudulent use of accounts.
                </li>
                <li>
                  <strong>Preferences:</strong> To remember your settings, such
                  as your preferred theme (Light/Dark mode) and layout choices.
                </li>
                <li>
                  <strong>Analytics:</strong> To understand how users interact
                  with our platform, helping us improve the service.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                3. Third-Party Cookies
              </h2>
              <p>
                We may also use various third-party cookies to report usage
                statistics and deliver certain services (such as Firebase
                Authentication). These cookies are governed by their respective
                privacy policies.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                4. Managing Cookies
              </h2>
              <p>
                Most web browsers allow you to control cookies through their
                settings preferences. However, if you limit the ability of
                websites to set cookies, you may worsen your overall user
                experience, as it will no longer be personalized.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
