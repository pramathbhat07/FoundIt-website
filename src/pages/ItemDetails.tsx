import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { db } from "../lib/firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import {
  MapPin,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Mail,
  Phone,
  Share2,
  MessageCircle,
  Link2,
} from "lucide-react";
import { type Item } from "../types";
import { QRCodeSVG } from "qrcode.react";

export default function ItemDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [startingChat, setStartingChat] = useState(false);

  const handleStartChat = async () => {
    if (!currentUser) {
      navigate("/signin");
      return;
    }
    if (!item || !id) return;

    try {
      setStartingChat(true);
      // Check if chat already exists
      const q = query(
        collection(db, "chats"),
        where("itemId", "==", id),
        where("participants", "array-contains", currentUser.uid),
      );
      const snapshot = await getDocs(q);

      let chatId = null;
      // We need to double check the other participant is the reporter
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.participants.includes(item.reporterId)) {
          chatId = doc.id;
        }
      });

      if (chatId) {
        navigate(`/chat/${chatId}`);
        return;
      }

      // Create new chat
      // Need reporter's name, we can fetch it or just use "Reporter"
      let reporterName = "Reporter";
      const reporterDoc = await getDoc(doc(db, "users", item.reporterId));
      if (reporterDoc.exists()) {
        reporterName = reporterDoc.data().name || "Reporter";
      }

      const participantNames: Record<string, string> = {
        [currentUser.uid]: currentUser.displayName || "User",
        [item.reporterId]: reporterName,
      };

      const newChatRef = await addDoc(collection(db, "chats"), {
        itemId: id,
        itemTitle: item.title,
        participants: [currentUser.uid, item.reporterId],
        participantNames,
        updatedAt: new Date().toISOString(),
      });

      navigate(`/chat/${newChatRef.id}`);
    } catch (err) {
      console.error("Error starting chat:", err);
      // fallback or error message could go here
    } finally {
      setStartingChat(false);
    }
  };

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const docRef = doc(db, "items", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setItem({
            id: docSnap.id,
            title: data.itemName || "Unknown Item",
            description: data.description || "",
            category: data.category as any,
            location: data.locationFound || data.lastLocation || "",
            date: data.createdAt || new Date().toISOString(),
            status: data.status || (data.type === "found" ? "found" : "lost"),
            reporterId: data.reporterId || "",
            image: data.image || undefined,
            type: data.type,
            contactEmail: data.email,
            contactPhone: data.phone,
          } as Item & {
            type?: "lost" | "found";
            contactEmail?: string;
            contactPhone?: string;
          });
        } else {
          setError("Item not found. It may have been removed.");
        }
      } catch (err) {
        console.error("Error fetching item:", err);
        setError("Failed to load item details.");
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-rose-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Item Not Found
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          {error || "The item you're looking for doesn't exist."}
        </p>
        <Link
          to="/"
          className="text-indigo-600 hover:text-indigo-600 dark:text-indigo-600 font-semibold"
        >
          ← Return to Home
        </Link>
      </div>
    );
  }

  const t = item.type?.toLowerCase();
  const s = item.status?.toLowerCase();
  const isLost = t === "lost" || s === "lost";

  const shareUrl = window.location.href;
  const shareTitle = `Check out this ${isLost ? "lost" : "found"} item: ${item.title}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <Link
        to={isLost ? "/lost" : "/found"}
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to {isLost ? "Lost Items" : "Found Items"}
      </Link>

      <div className="rounded-3xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-gray-200/50 dark:border-gray-800/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none overflow-hidden transition-colors">
        <div className="aspect-video w-full bg-gray-100/50 dark:bg-gray-800/50 flex items-center justify-center relative border-b border-gray-200/50 dark:border-gray-800/50">
          {item.image ? (
            <img
              src={item.image}
              alt={item.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-gray-500 dark:text-gray-400">
              No image available
            </span>
          )}
          <div className="absolute top-4 left-4">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium shadow-sm  ${
                isLost
                  ? "bg-rose-100/90 dark:bg-rose-500/10 text-rose-800 dark:text-rose-300 ring-1 ring-inset ring-rose-200 dark:ring-rose-500/20"
                  : "bg-emerald-100/90 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 ring-1 ring-inset ring-emerald-200 dark:ring-emerald-500/20"
              }`}
            >
              {isLost ? (
                <AlertCircle className="h-4 w-4" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
              {isLost ? "Lost Item" : "Found Item"}
            </span>
          </div>
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={() => setShowQR(!showQR)}
              className="h-10 w-10 flex items-center justify-center rounded-full bg-white dark:bg-black/50 text-gray-500 dark:text-white shadow hover:bg-white dark:hover:bg-black/70 transition-colors "
              title="Show QR Code"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="5" height="5" x="3" y="3" rx="1" />
                <rect width="5" height="5" x="16" y="3" rx="1" />
                <rect width="5" height="5" x="3" y="16" rx="1" />
                <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
                <path d="M21 21v.01" />
                <path d="M12 7v3a2 2 0 0 1-2 2H7" />
                <path d="M3 12h.01" />
                <path d="M12 3h.01" />
                <path d="M12 16v.01" />
                <path d="M16 12h1" />
                <path d="M21 12v.01" />
                <path d="M12 21v-1" />
              </svg>
            </button>
          </div>
          {(item.status === "resolved" || item.status === "returned") && (
            <div className="absolute inset-0 bg-black/40  flex items-center justify-center pointer-events-none">
              <span className="rounded-full bg-white px-6 py-2 font-bold text-gray-900 shadow-lg">
                {item.status === "resolved"
                  ? "Marked as Found"
                  : "Returned to Owner"}
              </span>
            </div>
          )}

          {showQR && (
            <div className="absolute inset-0 bg-white dark:bg-gray-900  flex flex-col items-center justify-center z-10 p-6">
              <div className="p-4 bg-white rounded-2xl shadow-xl mb-4">
                <QRCodeSVG value={shareUrl} size={180} />
              </div>
              <p className="text-gray-900 dark:text-white font-medium mb-6">
                Scan to view this item
              </p>
              <button
                onClick={() => setShowQR(false)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Close QR
              </button>
            </div>
          )}
        </div>

        <div className="p-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {item.title}
              </h1>
              <p className="inline-flex items-center rounded-md bg-indigo-600 text-white dark:bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-600 ring-1 ring-inset ring-violet-700/10 capitalize">
                {item.category}
              </p>
            </div>
            {currentUser?.uid !== item.reporterId && (
              <button
                onClick={handleStartChat}
                disabled={startingChat}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-500 transition-colors disabled:opacity-50"
              >
                <MessageCircle className="h-4 w-4" />
                {startingChat
                  ? "Starting chat..."
                  : `Message ${isLost ? "Finder" : "Reporter"}`}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 shrink-0">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  Location
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  {item.location}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 shrink-0">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  Date Reported
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  {new Date(item.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className="prose dark:prose-invert max-w-none mb-10">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Description
            </h3>
            <p className="text-gray-500 dark:text-gray-400 whitespace-pre-wrap leading-relaxed">
              {item.description}
            </p>
          </div>

          {(item as any).contactEmail && (
            <div className="border-t border-gray-200/50 dark:border-gray-800 pt-8">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Contact Information
              </h3>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                  <Mail className="h-5 w-5 shrink-0" />
                  <a
                    href={`mailto:${(item as any).contactEmail}`}
                    className="hover:text-indigo-600 dark:hover:text-indigo-600 transition-colors"
                  >
                    {(item as any).contactEmail}
                  </a>
                </div>
                {(item as any).contactPhone && (
                  <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                    <Phone className="h-5 w-5 shrink-0" />
                    <a
                      href={`tel:${(item as any).contactPhone}`}
                      className="hover:text-indigo-600 dark:hover:text-indigo-600 transition-colors"
                    >
                      {(item as any).contactPhone}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="border-t border-gray-200/50 dark:border-gray-800 pt-8 mt-8">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Share this item
            </h3>
            <div className="flex flex-wrap gap-3">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(shareTitle + " " + shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-green-500/10 px-4 py-2 text-sm font-medium text-green-700 dark:text-green-400 hover:bg-green-500/20 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
              <a
                href={`mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent("I found this item on FoundIt. Check it out here: " + shareUrl)}`}
                className="inline-flex items-center gap-2 rounded-xl bg-gray-100 dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Mail className="h-4 w-4" />
                Email
              </a>
              <button
                onClick={copyToClipboard}
                className="inline-flex items-center gap-2 rounded-xl bg-gray-100 dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
              >
                {copySuccess ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ) : (
                  <Link2 className="h-4 w-4" />
                )}
                {copySuccess ? "Copied!" : "Copy Link"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
