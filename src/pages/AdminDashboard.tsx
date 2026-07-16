import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../lib/firebase";
import {
  collection,
  query,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { ItemCard } from "../components/shared/ItemCard";
import { Item } from "../types";
import {
  CheckCircle2,
  Clock,
  MapPin,
  Package,
  Search,
  Trash2,
  ShieldAlert,
} from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../lib/utils";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const { currentUser, userProfile } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "lost" | "found" | "feedback">(
    "all",
  );

  useEffect(() => {
    fetchAllItems();
  }, [currentUser]);

  const fetchAllItems = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, "items"));

      const querySnapshot = await getDocs(q);
      const fetchedItems: Item[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        let itemType = data.type;
        if (!itemType && data.title === "Feedback Submission") {
          itemType = "feedback";
        }

        fetchedItems.push({
          id: docSnap.id,
          title: data.itemName || "Unknown Item",
          description: data.description || "",
          category: data.category as any,
          location: data.locationFound || data.lastLocation || "",
          date: data.createdAt || new Date().toISOString(),
          status: data.status || (itemType === "found" ? "found" : "lost"),
          type: itemType,
          reporterId: data.reporterId || "",
          image: data.image || undefined,
        });
      });

      fetchedItems.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
      setItems(fetchedItems);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (itemId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "items", itemId), {
        status: newStatus,
      });

      setItems(
        items.map((item) =>
          item.id === itemId ? { ...item, status: newStatus as any } : item,
        ),
      );
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status. Check Firebase rules.");
    }
  };

  const handleDelete = async (itemId: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this report? This action cannot be undone.",
      )
    )
      return;

    try {
      await deleteDoc(doc(db, "items", itemId));
      setItems(items.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete item. Check Firebase rules.");
    }
  };

  const filteredItems = items.filter(
    (item) => filter === "all" || item.type === filter,
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="md:flex md:items-center md:justify-between mb-8 pb-6 border-b border-gray-200/50 dark:border-gray-800">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
            <ShieldAlert className="h-8 w-8 text-indigo-600 dark:text-indigo-600" />
            Admin Portal
          </h1>
          <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">
            Manage all lost and found reports across the campus.
          </p>
        </div>
        <div className="mt-4 flex flex-col sm:flex-row gap-4 md:mt-0">
          <Link
            to="/report-lost"
            className="inline-flex justify-center items-center rounded-xl bg-white dark:bg-gray-800 px-4 py-2.5 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-300 dark:ring-gray-700 hover:bg-white dark:hover:bg-gray-700 transition-colors"
          >
            <Search className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
            Add Lost Report
          </Link>
          <Link
            to="/report-found"
            className="inline-flex justify-center items-center rounded-xl bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-500 transition-colors"
          >
            <Package className="mr-2 h-4 w-4" />
            Add Found Report
          </Link>
        </div>
      </div>

      <div className="rounded-3xl bg-white dark:bg-gray-800  border border-gray-200 dark:border-gray-800 dark:border-gray-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none overflow-hidden transition-colors">
        <div className="border-b border-gray-200/50 dark:border-gray-800 p-6 sm:p-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              All Master Reports
            </h2>
            <div className="mt-4 sm:mt-0 flex flex-wrap rounded-xl bg-gray-100 dark:bg-gray-800 p-1">
              {(["all", "lost", "found", "feedback"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t as any)}
                  className={cn(
                    "flex flex-1 sm:flex-none items-center justify-center px-4 py-1.5 text-sm font-medium rounded-lg transition-all capitalize",
                    filter === t
                      ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-gray-300 dark:ring-gray-700"
                      : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-200/50 dark:divide-white/[0.05]">
          {filteredItems.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="mx-auto h-12 w-12 text-gray-500 dark:text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-gray-400">
                No reports found
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                There are no reports in the system yet.
              </p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6 hover:bg-white dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset",
                        item.type === "lost"
                          ? "bg-rose-50 text-rose-700 ring-rose-600/10"
                          : item.type === "found"
                            ? "bg-emerald-50 text-emerald-700 ring-emerald-600/10"
                            : "bg-indigo-50 text-indigo-700 ring-indigo-600/10",
                      )}
                    >
                      {item.type === "lost"
                        ? "Lost Item"
                        : item.type === "found"
                          ? "Found Item"
                          : "Feedback"}
                    </span>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset",
                        item.status === "resolved" || item.status === "returned"
                          ? "bg-indigo-100 text-indigo-600 ring-indigo-600/10"
                          : "bg-amber-50 text-amber-700 ring-amber-600/10",
                      )}
                    >
                      Status: {item.status}
                    </span>
                    <span className="text-xs text-gray-500 font-mono">
                      ID: {item.id}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {item.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {new Date(item.date).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="sm:border-l sm:border-gray-200/50 dark:sm:border-gray-200 dark:border-gray-800 sm:pl-6 flex flex-row sm:flex-col items-center justify-center gap-3 shrink-0">
                  {item.type !== "feedback" &&
                    item.status !== "resolved" &&
                    item.status !== "returned" && (
                      <button
                        onClick={() =>
                          handleStatusChange(
                            item.id,
                            item.type === "lost" ? "resolved" : "returned",
                          )
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition-colors w-full sm:w-auto"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Mark {item.type === "lost" ? "Found" : "Returned"}
                      </button>
                    )}
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-rose-600 dark:text-rose-400 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-300 dark:ring-gray-700 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors w-full sm:w-auto"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
