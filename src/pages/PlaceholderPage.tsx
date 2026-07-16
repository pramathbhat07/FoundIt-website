import React from "react";
import { Settings, Construction } from "lucide-react";
import { Link } from "react-router-dom";

interface PlaceholderProps {
  title: string;
}

export default function PlaceholderPage({ title }: PlaceholderProps) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center py-24 px-4 text-center">
      <div className="rounded-full bg-indigo-600 text-white p-6 mb-8">
        <Construction className="h-16 w-16 text-indigo-600" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
        {title}
      </h1>
      <p className="max-w-xl text-lg text-gray-500 mb-8">
        We're working hard to bring this feature to life. It will be available
        in a future update along with user authentication and dashboard
        functionalities.
      </p>
      <Link
        to="/"
        className="rounded-full bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Return Home
      </Link>
    </div>
  );
}
