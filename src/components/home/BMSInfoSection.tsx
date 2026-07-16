import React from "react";
import { Building2, MapPin, GraduationCap, History } from "lucide-react";

export function BMSInfoSection() {
  return (
    <section className="py-24 bg-indigo-100 dark:bg-gray-900 relative overflow-hidden border-t border-gray-200/50 dark:border-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-600 text-white dark:bg-indigo-100 text-indigo-400 dark:text-indigo-600 text-sm font-semibold tracking-wide mb-6">
              <MapPin className="h-4 w-4" />
              Our Campus
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-6">
              BMS College of Engineering
            </h2>

            <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed mb-8">
              Located in the heart of Bengaluru, BMS College of Engineering
              (BMSCE) is an autonomous engineering college. Established in 1946,
              it has been a center of academic excellence and vibrant campus
              life.
            </p>

            <div className="space-y-6">
              <div className="flex gap-4 group">
                <div className="w-12 h-12 rounded-2xl glass-panel flex items-center justify-center shrink-0 group-hover:scale-110 group-active:scale-95 transition-transform duration-300">
                  <MapPin className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    Location
                  </h4>
                  <p className="text-gray-500 dark:text-gray-400">
                    Bull Temple Road, Basavanagudi, Bengaluru, Karnataka 560019
                    (Historically referenced as 560004 area).
                  </p>
                </div>
              </div>

              <div className="flex gap-4 group">
                <div className="w-12 h-12 rounded-2xl glass-panel flex items-center justify-center shrink-0 group-hover:scale-110 group-active:scale-95 transition-transform duration-300">
                  <History className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    Rich History
                  </h4>
                  <p className="text-gray-500 dark:text-gray-400">
                    The first private sector initiative in engineering education
                    in India, spanning sprawling acres of lush greenery and
                    historic buildings.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 group">
                <div className="w-12 h-12 rounded-2xl glass-panel flex items-center justify-center shrink-0 group-hover:scale-110 group-active:scale-95 transition-transform duration-300">
                  <GraduationCap className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    Campus Life
                  </h4>
                  <p className="text-gray-500 dark:text-gray-400">
                    From the bustling Platinum Jubilee Academic Block to the
                    legendary canteens, it's a massive campus where thousands of
                    students collaborate daily.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-purple-50/20 rounded-3xl blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative glass-panel rounded-3xl p-2 overflow-hidden aspect-[4/3] transform-gpu transition-transform duration-500 hover:rotate-1 hover:scale-[1.02]">
              <img
                src="https://www.comedk.org/uploads/bmsce-img-1.jpg"
                alt="BMSCE Platinum Jubilee Academic Block"
                className="w-full h-full object-cover rounded-2xl"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-2xl"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-3 text-gray-900 bg-white dark:bg-gray-800 dark:text-white px-4 py-2 rounded-xl w-fit">
                  <Building2 className="h-5 w-5" />
                  <span className="font-medium tracking-wide">
                    BMSCE Campus Tour
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
