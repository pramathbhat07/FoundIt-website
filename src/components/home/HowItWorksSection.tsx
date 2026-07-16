import React from "react";
import { Search, PlusCircle, CheckCircle } from "lucide-react";

const steps = [
  {
    name: "Report or Search",
    description:
      "Lost something? File a report or search the database. Found something? Turn it in and report it here.",
    icon: Search,
  },
  {
    name: "Match & Verify",
    description:
      "Our system automatically flags potential matches. Detailed descriptions and secure messaging help verify ownership.",
    icon: PlusCircle,
  },
  {
    name: "Reunite",
    description:
      "Once verified, arrange a safe meetup or pick up the item securely from a designated campus security office.",
    icon: CheckCircle,
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-24 bg-gray-900 dark:bg-transparent dark:border-y dark:border-gray-800 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            How FoundIt Works
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            A simple, secure process to get items back to their rightful owners.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.name} className="relative text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 mb-6">
                <step.icon className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="mb-3 text-xl font-semibold">{step.name}</h3>
              <p className="text-gray-500 leading-relaxed text-sm lg:text-base">
                {step.description}
              </p>

              {/* Connector line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] border-t border-dashed border-gray-200 -z-10" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
