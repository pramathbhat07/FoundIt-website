import React from "react";
import { Search } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

export function HeroSection() {
  const [query, setQuery] = React.useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/lost?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="relative overflow-hidden pt-16 pb-32 sm:pt-24 sm:pb-40 lg:pb-48">
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-indigo-600 to-fuchsia-600 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        ></div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-display text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl"
          >
            Lost something? <br />
            <span className="text-indigo-600 dark:text-indigo-400">
              Let's find it together.
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 text-lg leading-8 text-gray-500 dark:text-gray-400"
          >
            The fastest, easiest way to report lost items and search for found
            belongings across campus. Reconnecting you with what matters.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-10 max-w-xl mx-auto"
          >
            <form
              onSubmit={handleSearch}
              className="relative flex items-center"
            >
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <Search className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="block w-full rounded-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 py-4 pl-11 pr-4 text-gray-900 dark:text-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-none placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-600/50 dark:focus:ring-indigo-500 sm:text-lg sm:leading-6 transition-colors duration-300"
                  placeholder="Search for 'blue wallet' or 'keys'..."
                />
              </div>
              <button
                type="submit"
                className="absolute right-2 rounded-full bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Search
              </button>
            </form>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Popular:
              </span>
              {["hydroflask", "airpods", "student ID", "keys"].map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setQuery(term);
                  }}
                  className="text-sm text-indigo-600 dark:text-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-600 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
