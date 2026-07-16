export type ItemCategory =
  | "electronics"
  | "keys"
  | "wallets"
  | "clothing"
  | "bags"
  | "ids"
  | "other";
export type ItemStatus =
  | "lost"
  | "found"
  | "resolved"
  | "returned"
  | "Lost"
  | "Found";

export interface Item {
  id: string;
  title: string;
  description: string;
  category: ItemCategory;
  location: string;
  date: string;
  image?: string;
  status: ItemStatus;
  type?: "lost" | "found";
  reporterId: string;
  contactEmail?: string;
  contactPhone?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

export interface Chat {
  id: string;
  itemId: string;
  itemTitle: string;
  participants: string[]; // user UIDs
  participantNames?: Record<string, string>; // UID to Name mapping
  lastMessage?: string;
  lastMessageTime?: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  createdAt: string;
  isEdited?: boolean;
}

export interface Feedback {
  id: string;
  userId: string;
  userEmail?: string;
  userName?: string;
  message: string;
  createdAt: string;
  status: "pending" | "reviewed";
}
