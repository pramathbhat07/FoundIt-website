import React from "react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-200 dark:border-gray-800">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
            Terms of Service
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="space-y-8 text-gray-500 dark:text-gray-400">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing or using the Campus Lost & Found platform, you
                agree to be bound by these Terms of Service. If you do not agree
                to these terms, please do not use the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                2. User Responsibilities
              </h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  You must provide accurate and complete information when
                  creating reports or communicating with others.
                </li>
                <li>
                  You are responsible for maintaining the confidentiality of
                  your account credentials.
                </li>
                <li>
                  You agree to use the platform only for its intended purpose:
                  reporting and recovering lost items within the campus.
                </li>
                <li>
                  Any fraudulent claims, misrepresentation, or misuse of the
                  platform may result in immediate account suspension.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                3. Content Ownership
              </h2>
              <p>
                While you retain ownership of the content you submit (such as
                descriptions and images of items), you grant Campus Lost & Found
                a license to use, display, and distribute that content for the
                purpose of operating the platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                4. Liability
              </h2>
              <p>
                Campus Lost & Found is a facilitator for connecting users. We do
                not guarantee the recovery of any lost item, nor are we
                responsible for the condition of items recovered through the
                platform. We are not liable for interactions or disputes between
                users.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                5. Modifications
              </h2>
              <p>
                We reserve the right to modify these terms at any time. Your
                continued use of the platform following any changes indicates
                your acceptance of the new terms.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
