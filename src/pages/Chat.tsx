import React, { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { db } from "../lib/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { ArrowLeft, Send, Edit2, Trash2, X, Check } from "lucide-react";
import { type Chat, type Message } from "../types";

export default function ChatPage() {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editMessageText, setEditMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!currentUser) {
      navigate("/signin");
      return;
    }

    if (!id) return;

    // Fetch Chat Details
    const chatDocRef = doc(db, "chats", id);
    const unsubscribeChat = onSnapshot(chatDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const chatData = { id: docSnap.id, ...docSnap.data() } as Chat;
        // Verify current user is part of chat
        if (!chatData.participants.includes(currentUser.uid)) {
          navigate("/messages");
          return;
        }
        setChat(chatData);
      } else {
        navigate("/messages");
      }
    });

    // Fetch Messages
    const q = query(collection(db, "messages"), where("chatId", "==", id));

    const unsubscribeMessages = onSnapshot(q, (snapshot) => {
      const fetchedMessages: Message[] = [];
      snapshot.forEach((doc) => {
        fetchedMessages.push({ id: doc.id, ...doc.data() } as Message);
      });
      // Sort client-side
      fetchedMessages.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
      setMessages(fetchedMessages);
      setLoading(false);
      // scroll to bottom
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    });

    return () => {
      unsubscribeChat();
      unsubscribeMessages();
    };
  }, [id, currentUser, navigate]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser || !id || !chat) return;

    try {
      const messageText = newMessage.trim();
      setNewMessage("");

      // Add message
      await addDoc(collection(db, "messages"), {
        chatId: id,
        senderId: currentUser.uid,
        text: messageText,
        createdAt: new Date().toISOString(),
      });

      // Update chat lastMessage
      await updateDoc(doc(db, "chats", id), {
        lastMessage: messageText,
        lastMessageTime: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      await deleteDoc(doc(db, "messages", messageId));
    } catch (error) {
      console.error("Error deleting message: ", error);
    }
  };

  const handleEditSubmit = async (messageId: string) => {
    if (!editMessageText.trim()) return;
    try {
      await updateDoc(doc(db, "messages", messageId), {
        text: editMessageText.trim(),
        isEdited: true,
      });
      setEditingMessageId(null);
      setEditMessageText("");
    } catch (error) {
      console.error("Error updating message: ", error);
    }
  };

  const startEditing = (message: Message) => {
    setEditingMessageId(message.id);
    setEditMessageText(message.text);
  };

  const cancelEditing = () => {
    setEditingMessageId(null);
    setEditMessageText("");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!chat) return null;

  const otherUserId = chat.participants.find((p) => p !== currentUser?.uid);
  const otherUserName =
    chat.participantNames && otherUserId
      ? chat.participantNames[otherUserId]
      : "User";

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="flex items-center gap-4 mb-6">
        <Link
          to="/messages"
          className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            {otherUserName}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Re: {chat.itemTitle}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-gray-900 rounded-t-3xl border border-gray-200 dark:border-gray-800 border-b-0 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-10">
            No messages yet. Send a message to start the conversation!
          </div>
        ) : (
          messages.map((message) => {
            const isMe = message.senderId === currentUser?.uid;
            const isEditing = editingMessageId === message.id;

            return (
              <div
                key={message.id}
                className={`flex group ${isMe ? "justify-end" : "justify-start"}`}
              >
                {isMe && !isEditing && (
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity mr-2">
                    <button
                      onClick={() => startEditing(message)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-500 hover:text-indigo-600 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteMessage(message.id)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-500 hover:text-rose-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-2 relative ${
                    isMe
                      ? "bg-indigo-600 text-white rounded-tr-sm"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-tl-sm"
                  }`}
                >
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editMessageText}
                        onChange={(e) => setEditMessageText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                             handleEditSubmit(message.id);
                          } else if (e.key === 'Escape') {
                             cancelEditing();
                          }
                        }}
                        className="bg-indigo-700 text-white outline-none rounded-md px-2 py-1 flex-1 text-sm text-balance w-full border border-indigo-500"
                        autoFocus
                      />
                      <button onClick={() => handleEditSubmit(message.id)} className="text-white hover:text-green-300">
                        <Check className="h-4 w-4" />
                      </button>
                      <button onClick={cancelEditing} className="text-white hover:text-rose-300">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <p className="break-words">{message.text}</p>
                      <div
                        className={`flex items-center gap-1 mt-1 ${isMe ? "text-indigo-200" : "text-gray-500"}`}
                      >
                       <span className="text-[10px] block">
                        {new Date(message.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                       </span>
                       {message.isEdited && <span className="text-[10px] italic">(edited)</span>}
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSendMessage}
        className="bg-white dark:bg-gray-900 p-4 rounded-b-3xl border border-gray-200 dark:border-gray-800 flex gap-3"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2 text-gray-900 dark:text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />
        <button
          type="submit"
          disabled={!newMessage.trim()}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600 text-white p-3 rounded-xl transition-colors flex items-center justify-center aspect-square"
        >
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
}
