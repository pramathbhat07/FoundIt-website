import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ItemCard } from "../shared/ItemCard";
import { type Item } from "../../types";
import airpodsImage from "../../assets/images/airpods_pro_1780926463983.png";
import { db } from "../../lib/firebase";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";

export function RecentItemsSection() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentItems = async () => {
      try {
        const q = query(
          collection(db, "items"),
          orderBy("createdAt", "desc"),
          limit(4),
        );
        const querySnapshot = await getDocs(q);

        const fetchedItems: Item[] = [];
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
            status: data.status || "lost",
            type: data.type || "lost",
            reporterId: data.reporterId || "",
            image: data.image || undefined, // if we eventually save image URL
          });
        });

        if (fetchedItems.length === 0) {
          // Fallback static data if no items exist yet
          setItems([
            {
              id: "1",
              title: "Apple AirPods Pro",
              description:
                "Found a standalone AirPods Pro case with the right earbud inside.",
              category: "electronics",
              location: "Main Library, 2nd Floor",
              date: new Date().toISOString(),
              status: "found",
              reporterId: "user1",
              image: airpodsImage,
            },
            {
              id: "2",
              title: "Blue Hydroflask",
              description:
                "Lost my blue 32oz Hydroflask covered in various tech stickers.",
              category: "other",
              location: "Science Building, Room 104",
              date: new Date(Date.now() - 86400000).toISOString(),
              status: "lost",
              reporterId: "user2",
              image:
                "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=800",
            },
          ]);
        } else {
          setItems(fetchedItems);
        }
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentItems();
  }, []);

  return (
    <section className="py-24 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Recent Activity
            </h2>
            <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">
              The latest lost and found items reported on campus.
            </p>
          </div>
          <div className="mt-4 flex gap-4 md:mt-0">
            <Link
              to="/lost"
              className="text-sm font-semibold leading-6 text-indigo-600 dark:text-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-600 flex items-center gap-1"
            >
              View all lost <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/found"
              className="text-sm font-semibold leading-6 text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 flex items-center gap-1"
            >
              View all found <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center p-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
