import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ItemCard } from "../components/shared/ItemCard";
import { type Item } from "../types";
import { db } from "../lib/firebase";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { Search } from "lucide-react";

interface ItemsListProps {
  type: "lost" | "found";
  title: string;
  description: string;
}

export default function ItemsList({
  type,
  title,
  description,
}: ItemsListProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();

  useEffect(() => {
    // Check if there's a search term in the URL
    const searchParams = new URLSearchParams(location.search);
    const categoryQuery = searchParams.get("category");
    const qParam = searchParams.get("q");

    if (qParam) {
      setSearchQuery(qParam);
    }

    const fetchItems = async () => {
      try {
        setLoading(true);
        // Note: Firestore doesn't support full-text search directly without setup.
        // We will fetch by type and sort, then filter locally for simplicity in this demo.
        const q = query(
          collection(db, "items"),
          where("type", "==", type),
          // We can't orderBy "createdAt" here without composite index on (type, createdAt)
          // Default order will be document ID which is chronologicalish
        );

        const querySnapshot = await getDocs(q);

        let fetchedItems: Item[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.type === "feedback" || data.title === "Feedback Submission")
            return;
          fetchedItems.push({
            id: doc.id,
            title: data.itemName || "Unknown Item",
            description: data.description || "",
            category: data.category as any,
            location: data.locationFound || data.lastLocation || "",
            date: data.createdAt || new Date().toISOString(),
            status: data.status || (type === "found" ? "found" : "lost"),
            type: data.type || type,
            reporterId: data.reporterId || "",
            image: data.image || undefined,
            createdAt: data.createdAt || new Date().toISOString(), // For local sorting
          } as Item & { createdAt: string });
        });

        // Filter out resolved items by default unless you want to show them
        // fetchedItems = fetchedItems.filter(item => item.status !== 'resolved' && item.status !== 'returned');

        // Local sort (since composite index might be missing)
        fetchedItems.sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );

        // Local category filter
        if (categoryQuery) {
          fetchedItems = fetchedItems.filter(
            (item) => item.category === categoryQuery,
          );
        }

        setItems(fetchedItems);
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [type, location.search]);

  // Local Search Filter
  const displayItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="md:flex md:items-center md:justify-between mb-8 pb-6 border-b border-gray-200/50 dark:border-gray-800">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white capitalize">
            {title}
          </h1>
          <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">
            {description}
          </p>
        </div>

        <div className="mt-4 md:mt-0 relative max-w-sm w-full shrink-0">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items, locations..."
            className="block w-full rounded-xl border-0 py-2.5 pl-10 pr-4 text-gray-900 dark:text-white dark:bg-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:focus:ring-white sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
        </div>
      ) : displayItems.length === 0 ? (
        <div className="text-center py-24 px-4 bg-white dark:bg-gray-800  rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
          <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-gray-500 dark:text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No items found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Try adjusting your search criteria or browse another category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {displayItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
