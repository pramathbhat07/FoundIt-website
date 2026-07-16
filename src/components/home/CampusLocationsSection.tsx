import React from "react";
import { MapPin, Clock } from "lucide-react";

const locations = [
  {
    name: "Sports Room",
    building: "Near Indoor stadium",
    hours: "Mon-Sat: 8AM to 6PM",
    description:
      "Primary holding area for high-value items like electronics and valid IDs.",
  },
  {
    name: "Dean office",
    building: "APS BLOCK Ground floor",
    hours: "Mon-Sat: 8AM - 6PM",
    description: "Holding area for items lost within the library premises.",
  },
  {
    name: "Reception Area",
    building: "PJ block Ground floor",
    hours: "Mon-Sat: 8AM - 6PM",
    description: "Holding area for sports gear, clothing, and water bottles.",
  },
];

export function CampusLocationsSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Campus Drop-off Locations
          </h2>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
            Where to securely turn in found items or retrieve your verified lost
            property.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {locations.map((location) => (
            <div
              key={location.name}
              className="flex flex-col rounded-3xl bg-white dark:bg-gray-800  border border-gray-200 dark:border-gray-800 dark:border-gray-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none p-8 transition-all hover:bg-white dark:hover:bg-gray-700 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)]"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {location.name}
              </h3>
              <div className="mt-4 flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <MapPin className="h-5 w-5 text-indigo-600 dark:text-indigo-600 shrink-0" />
                <span>{location.building}</span>
              </div>
              <div className="mt-2 flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <Clock className="h-5 w-5 text-indigo-600 dark:text-indigo-600 shrink-0" />
                <span>{location.hours}</span>
              </div>
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 flex-1">
                {location.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
