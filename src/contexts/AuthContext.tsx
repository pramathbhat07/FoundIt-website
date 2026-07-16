import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

interface UserProfile {
  role: "user" | "admin";
  name?: string;
  usn?: string;
  department?: string;
  email?: string;
}

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Fetch user profile from Firestore
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const data = userDoc.data() as UserProfile;

            // Auto-upgrade specific email to admin
            if (
              user.email === "kspramath.ec25@bmsce.ac.in" &&
              data.role !== "admin"
            ) {
              try {
                await updateDoc(userDocRef, { role: "admin" });
                data.role = "admin";
              } catch (e) {
                console.error("Failed to upgrade to admin:", e);
              }
            }

            setUserProfile(data);
          } else {
            setUserProfile({
              role:
                user.email === "kspramath.ec25@bmsce.ac.in" ? "admin" : "user",
            }); // Fallback
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setUserProfile({
            role:
              user.email === "kspramath.ec25@bmsce.ac.in" ? "admin" : "user",
          });
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ currentUser, userProfile, loading, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
