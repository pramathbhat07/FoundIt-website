import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Calendar, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "../../lib/utils";
import { type Item } from "../../types";

interface ItemCardProps {
  item: Item;
  key?: React.Key;
}

export function ItemCard({ item }: ItemCardProps) {
  const t = item.type?.toLowerCase();
  const s = item.status?.toLowerCase();
  const isLost = t === "lost" || s === "lost";

  return (
    <Link
      to={`/${isLost ? "lost" : "found"}/${item.id}`}
      className="group relative flex flex-col overflow-hidden rounded-3xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-gray-200/50 dark:border-gray-800/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.4)] transition-all hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:bg-white/90 dark:hover:bg-gray-700/80"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-white/50 dark:bg-gray-800/50">
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
            No image available
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium shadow-sm ",
              isLost
                ? "bg-rose-100/90 dark:bg-rose-500/10 text-rose-800 dark:text-rose-300 ring-1 ring-inset ring-rose-200 dark:ring-rose-500/20"
                : "bg-emerald-100/90 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 ring-1 ring-inset ring-emerald-200 dark:ring-emerald-500/20",
            )}
          >
            {isLost ? (
              <AlertCircle className="h-3 w-3" />
            ) : (
              <CheckCircle className="h-3 w-3" />
            )}
            {isLost ? "Lost" : "Found"}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-1 text-lg font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-600 transition-colors">
          {item.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
          {item.description}
        </p>

        <div className="mt-auto pt-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <MapPin className="h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400" />
            <span className="line-clamp-1">{item.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Calendar className="h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400" />
            <span>{new Date(item.date).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
