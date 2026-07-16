import React from "react";
import { Link } from "react-router-dom";
import {
  Smartphone,
  Key,
  Wallet,
  Shirt,
  Briefcase,
  CreditCard,
  HelpCircle,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { type ItemCategory } from "../../types";

const categories: {
  id: ItemCategory;
  name: string;
  icon: React.ElementType;
  color: string;
  count: number;
}[] = [
  {
    id: "electronics",
    name: "Electronics",
    icon: Smartphone,
    color: "bg-blue-100 text-blue-600",
    count: 124,
  },
  {
    id: "keys",
    name: "Keys",
    icon: Key,
    color: "bg-amber-100 text-amber-600",
    count: 86,
  },
  {
    id: "wallets",
    name: "Wallets",
    icon: Wallet,
    color: "bg-emerald-100 text-emerald-600",
    count: 53,
  },
  {
    id: "clothing",
    name: "Clothing",
    icon: Shirt,
    color: "bg-rose-100 text-rose-600",
    count: 42,
  },
  {
    id: "bags",
    name: "Bags & Backpacks",
    icon: Briefcase,
    color: "bg-indigo-100 text-indigo-600",
    count: 38,
  },
  {
    id: "ids",
    name: "Cards & IDs",
    icon: CreditCard,
    color: "bg-indigo-100 text-indigo-600",
    count: 156,
  },
  {
    id: "other",
    name: "Other Items",
    icon: HelpCircle,
    color: "bg-gray-100 text-gray-500",
    count: 29,
  },
];

export function CategoriesSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Browse by Category
          </h2>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
            Quickly drill down to find exactly what you're looking for.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/lost?category=${category.id}`}
              className="group flex flex-col items-center justify-center rounded-3xl glass-panel p-6 text-center transition-all duration-300 hover:shadow-xl dark:hover:bg-gray-700 hover:-translate-y-1 active:scale-95"
            >
              <div
                className={cn(
                  "mb-4 rounded-full p-4 transition-transform duration-300 group-hover:scale-110",
                  category.color,
                )}
              >
                <category.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {category.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {category.count} items
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
