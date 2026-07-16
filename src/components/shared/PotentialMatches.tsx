import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { type MatchResult } from "../../lib/matching";

interface PotentialMatchesProps {
  matches: MatchResult[];
  type: "lost" | "found"; // the type of the target item the user just reported
}

export function PotentialMatches({ matches, type }: PotentialMatchesProps) {
  if (matches.length === 0) return null;

  const oppositeType = type === "lost" ? "found" : "lost";

  return (
    <div className="mt-12 mb-8 bg-white dark:bg-gray-800  border border-gray-200 dark:border-gray-800 dark:border-gray-800 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-none rounded-3xl p-6 md:p-8">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="h-6 w-6 text-indigo-600" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Potential Matches Found
        </h3>
      </div>

      <p className="text-gray-500 dark:text-gray-400 mb-6">
        We found some {oppositeType} items that look similar to what you just
        reported. Take a look to see if it's yours!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matches.slice(0, 3).map((match) => (
          <div
            key={match.item.id}
            className="group relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-all"
          >
            <div className="aspect-video w-full bg-gray-100 dark:bg-gray-800 relative flex items-center justify-center">
              {match.item.image ? (
                <img
                  src={match.item.image}
                  alt={match.item.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <span className="text-gray-500 dark:text-gray-400 text-sm">
                  No image
                </span>
              )}
              <div className="absolute top-2 right-2">
                <div className="bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
                  {match.score}% Match
                </div>
              </div>
            </div>
            <div className="p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white truncate mb-1">
                {match.item.title}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-1">
                {match.item.location}
              </p>

              <div className="flex flex-wrap gap-1 mb-4">
                {match.matchReasons.map((reason, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] uppercase font-bold tracking-wider rounded-md bg-indigo-600 text-white dark:bg-indigo-100 text-indigo-400 border border-violet-100 dark:border-indigo-600/20 px-1.5 py-0.5"
                  >
                    {reason}
                  </span>
                ))}
              </div>

              <Link
                to={`/${oppositeType}/${match.item.id}`}
                className="inline-flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-600"
              >
                View Details <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
