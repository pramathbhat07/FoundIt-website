import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../lib/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { MessageSquare } from "lucide-react";
import { type Chat } from "../types";

export default function Messages() {
  const { currentUser } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/signin");
      return;
    }

    const q = query(
      collection(db, "chats"),
      where("participants", "array-contains", currentUser.uid),
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedChats: Chat[] = [];
        snapshot.forEach((doc) => {
          fetchedChats.push({ id: doc.id, ...doc.data() } as Chat);
        });

        fetchedChats.sort(
          (a, b) =>
            new Date(b.updatedAt || 0).getTime() -
            new Date(a.updatedAt || 0).getTime(),
        );
        setChats(fetchedChats);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching chats:", error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [currentUser, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Messages
        </h1>
        <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">
          Your conversations about lost and found items.
        </p>
      </div>

      {chats.length === 0 ? (
        <div className="text-center py-24 bg-white dark:bg-gray-800  rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No messages yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            When you contact item reporters or someone contacts you, your chats
            will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 overflow-hidden divide-y divide-gray-200 dark:divide-white/[0.05]">
          {chats.map((chat) => {
            const otherUserId = chat.participants.find(
              (p) => p !== currentUser?.uid,
            );
            const otherUserName =
              chat.participantNames && otherUserId
                ? chat.participantNames[otherUserId]
                : "User";

            return (
              <Link
                key={chat.id}
                to={`/chat/${chat.id}`}
                className="block p-6 hover:bg-white dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {otherUserName}
                  </h3>
                  {chat.lastMessageTime && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(chat.lastMessageTime).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-100 dark:text-indigo-600">
                    Item: {chat.itemTitle}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {chat.lastMessage || "No messages yet"}
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
