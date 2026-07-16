import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Upload, CheckCircle2, ArrowLeft, Eye } from "lucide-react";
import { motion } from "motion/react";
import { cn, compressImage } from "../lib/utils";
import { type ItemCategory } from "../types";
import { db } from "../lib/firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { PotentialMatches } from "../components/shared/PotentialMatches";
import { findTopMatches, type MatchResult } from "../lib/matching";
import { useAuth } from "../contexts/AuthContext";
import { QRCodeSVG } from "qrcode.react";

interface FormData {
  itemName: string;
  category: string;
  brand: string;
  color: string;
  description: string;
  uniqueIdentifiers: string;
  dateFound: string;
  timeFound: string;
  locationFound: string;
  storageLocation: string;
  status: string;
  image: File | null;
  name: string;
  email: string;
  phone: string;
  department: string;
  usn: string;
  semester: string;
}

const initialFormData: FormData = {
  itemName: "",
  category: "",
  brand: "",
  color: "",
  description: "",
  uniqueIdentifiers: "",
  dateFound: "",
  timeFound: "",
  locationFound: "",
  storageLocation: "",
  status: "Turned into Security",
  image: null,
  name: "",
  email: "",
  phone: "",
  department: "",
  usn: "",
  semester: "",
};

const categories = [
  { value: "electronics", label: "Electronics (Phones, Laptops, Earbuds)" },
  { value: "keys", label: "Keys" },
  { value: "wallets", label: "Wallets & Purses" },
  { value: "clothing", label: "Clothing & Jackets" },
  { value: "bags", label: "Bags & Backpacks" },
  { value: "ids", label: "Cards & IDs" },
  { value: "other", label: "Other Items" },
];

export default function ReportFound() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isPreview, setIsPreview] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [potentialMatches, setPotentialMatches] = useState<MatchResult[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { currentUser } = useAuth();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({ ...prev, image: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setIsSubmitting(true);
    try {
      const { image, ...dataToSave } = formData;
      let base64Image = undefined;

      if (image) {
        try {
          base64Image = await compressImage(image);
        } catch (err) {
          console.error("Failed to compress image:", err);
        }
      }

      const docRef = await addDoc(collection(db, "items"), {
        ...dataToSave,
        ...(base64Image ? { image: base64Image } : {}),
        type: "found",
        reporterId: currentUser.uid,
        createdAt: new Date().toISOString(),
      });

      setSubmittedId(docRef.id);

      const reportUrl = `${window.location.origin}/found/${docRef.id}`;

      // Send email notification to reporter
      await fetch("/api/notify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          type: "found",
          itemName: formData.itemName,
          reportUrl,
        }),
      }).catch((err) => console.error("Notification trigger failed:", err));

      // Fetch all users to notify them
      try {
        const usersSnapshot = await getDocs(collection(db, "users"));
        const allEmails = usersSnapshot.docs
          .map(doc => doc.data().email)
          .filter(email => email && typeof email === 'string');
        
        if (allEmails.length > 0) {
          await fetch("/api/notify-all", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              emails: allEmails,
              type: "found",
              itemName: formData.itemName,
              reportUrl,
              reporterName: formData.contactName || "A user"
            }),
          }).catch((err) => console.error("Broadcast notification failed:", err));
        }
      } catch (userErr) {
        console.error("Failed to fetch users for notification:", userErr);
      }

      // Find matches before showing success
      try {
        const matchingQuery = query(
          collection(db, "items"),
          where("type", "==", "lost"),
        );
        const matchingSnapshot = await getDocs(matchingQuery);
        const candidates = matchingSnapshot.docs.map(
          (d) => ({ id: d.id, ...d.data() }) as any,
        );

        // Target is what we just submitted
        const matches = findTopMatches(
          { id: docRef.id, title: dataToSave.itemName, ...dataToSave },
          candidates,
          35,
        );
        setPotentialMatches(matches);
      } catch (matchErr) {
        console.error("Matching error:", matchErr);
      }

      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Error submitting report: ", error);
      alert("Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted && submittedId) {
    const reportUrl = `${window.location.origin}/found/${submittedId}`;
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4 py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mx-auto max-w-md rounded-3xl bg-white dark:bg-gray-900  border border-gray-200 dark:border-gray-800 dark:border-gray-800 p-8 text-center shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-none transition-colors"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/10 mb-6">
            <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Item Successfully Reported
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Thank you for reporting this found item! The item is now listed in
            our database for the owner to find, and we've sent an email
            confirmation.
          </p>

          <PotentialMatches matches={potentialMatches} type="found" />

          <div className="mb-8 flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-800">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
              Share or save this QR code
            </p>
            <div className="p-3 bg-white rounded-xl shadow-sm">
              <QRCodeSVG value={reportUrl} size={160} />
            </div>
            <p className="text-xs text-gray-500 mt-4 break-all max-w-[250px]">
              {reportUrl}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Link
              to="/found"
              className="w-full rounded-xl bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-500 transition-colors"
            >
              Browse Found Items
            </Link>
            <Link
              to="/"
              className="w-full rounded-xl bg-white dark:bg-gray-800 px-4 py-3 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Return Home
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 hover:text-indigo-600 mb-4 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Link>
        <h1 className="font-display text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Report a Found Item
        </h1>
        <p className="mt-2 text-lg text-gray-500">
          Help reunite a lost item with its owner by providing detailed
          information about where and when you found it.
        </p>
      </div>

      <div className="rounded-3xl bg-white  border border-gray-200 dark:border-gray-800 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-10">
        {!isPreview ? (
          <form onSubmit={handleSubmit} className="space-y-12">
            {/* Item Information */}
            <div className="border-b border-gray-200/10 pb-12">
              <h2 className="text-xl font-semibold leading-7 text-gray-900 dark:text-white">
                Item Details
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-500">
                What did you find? Describe it clearly.
              </p>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label
                    htmlFor="itemName"
                    className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                  >
                    Item Name <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="itemName"
                      id="itemName"
                      required
                      placeholder="e.g., Apple AirPods Pro, Blue Hydroflask"
                      value={formData.itemName}
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 py-2.5 px-3.5 text-gray-900 dark:text-white dark:bg-gray-800 shadow-sm dark:ring-gray-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                  >
                    Category <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      id="category"
                      name="category"
                      list="category-options"
                      required
                      placeholder="Select or type category"
                      value={formData.category}
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 py-2.5 px-3.5 text-gray-900 dark:text-white dark:bg-gray-800 shadow-sm dark:ring-gray-700 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    <datalist id="category-options">
                      {categories.map((cat) => (
                        <option key={cat.value} value={cat.label} />
                      ))}
                    </datalist>
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="brand"
                    className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                  >
                    Brand / Manufacturer
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="brand"
                      id="brand"
                      placeholder="e.g., Apple, Nike, Casio"
                      value={formData.brand}
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 py-2.5 px-3.5 text-gray-900 dark:text-white dark:bg-gray-800 shadow-sm dark:ring-gray-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="color"
                    className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                  >
                    Primary Color
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="color"
                      id="color"
                      placeholder="e.g., Black, Navy Blue, Silver"
                      value={formData.color}
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 py-2.5 px-3.5 text-gray-900 dark:text-white dark:bg-gray-800 shadow-sm dark:ring-gray-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                  >
                    Description <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      required
                      placeholder="General appearance, condition, what's inside (if applicable)..."
                      value={formData.description}
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 py-2.5 px-3.5 text-gray-900 dark:text-white dark:bg-gray-800 shadow-sm dark:ring-gray-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="uniqueIdentifiers"
                    className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                  >
                    Unique Identifiers (Kept private for verification)
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="uniqueIdentifiers"
                      name="uniqueIdentifiers"
                      rows={2}
                      placeholder="e.g., Specific stickers, damage, wallpaper on lock screen, serial number..."
                      value={formData.uniqueIdentifiers}
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 py-2.5 px-3.5 text-gray-900 dark:text-white dark:bg-gray-800 shadow-sm dark:ring-gray-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    We will use this to ask the claimant to verify ownership.
                  </p>
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="image"
                    className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                  >
                    Upload Image
                  </label>
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-200/25 px-6 py-10">
                    <div className="text-center">
                      {previewImage ? (
                        <div className="mb-4 flex flex-col items-center">
                          <img
                            src={previewImage}
                            alt="Preview"
                            className="h-32 w-32 object-cover rounded-lg shadow-sm"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setPreviewImage(null);
                              setFormData((p) => ({ ...p, image: null }));
                            }}
                            className="mt-2 text-sm text-red-600 hover:text-red-500"
                          >
                            Remove image
                          </button>
                        </div>
                      ) : (
                        <Upload
                          className="mx-auto h-12 w-12 text-gray-500"
                          aria-hidden="true"
                        />
                      )}
                      {!previewImage && (
                        <div className="mt-4 flex text-sm leading-6 text-gray-500 justify-center">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-600"
                          >
                            <span>Upload a file</span>
                            <input
                              id="file-upload"
                              name="image"
                              type="file"
                              accept="image/*"
                              className="sr-only"
                              onChange={handleImageChange}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                      )}
                      <p className="text-xs leading-5 text-gray-500">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Location & Time Information */}
            <div className="border-b border-gray-200/10 pb-12">
              <h2 className="text-xl font-semibold leading-7 text-gray-900 dark:text-white">
                When, Where & Status
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-500">
                Where did you find the item, and where is it now?
              </p>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="dateFound"
                    className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                  >
                    Date Found <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-2">
                    <input
                      type="date"
                      name="dateFound"
                      id="dateFound"
                      required
                      value={formData.dateFound}
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 py-2.5 px-3.5 text-gray-900 dark:text-white dark:bg-gray-800 shadow-sm dark:ring-gray-700 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="timeFound"
                    className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                  >
                    Time Found
                  </label>
                  <div className="mt-2">
                    <input
                      type="time"
                      name="timeFound"
                      id="timeFound"
                      value={formData.timeFound}
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 py-2.5 px-3.5 text-gray-900 dark:text-white dark:bg-gray-800 shadow-sm dark:ring-gray-700 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="locationFound"
                    className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                  >
                    Location Found <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="locationFound"
                      id="locationFound"
                      required
                      placeholder="e.g., Library 2nd Floor near the stairs, Cafe 101 bench"
                      value={formData.locationFound}
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 py-2.5 px-3.5 text-gray-900 dark:text-white dark:bg-gray-800 shadow-sm dark:ring-gray-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="col-span-3">
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                  >
                    Current Status <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-2">
                    <select
                      id="status"
                      name="status"
                      required
                      value={formData.status}
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 py-2.5 px-3.5 text-gray-900 dark:text-white dark:bg-gray-800 shadow-sm dark:ring-gray-700 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    >
                      <option value="Turned into Security">
                        Turned into Campus Security
                      </option>
                      <option value="With me">I am holding onto it</option>
                      <option value="Left at location">
                        Left it where I found it
                      </option>
                      <option value="Turned into Department">
                        Turned into Department Office
                      </option>
                    </select>
                  </div>
                </div>

                <div className="col-span-3">
                  <label
                    htmlFor="storageLocation"
                    className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                  >
                    Where did you store the item?
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="storageLocation"
                      id="storageLocation"
                      placeholder="e.g., Main Security Desk, With me in Hostel block A"
                      value={formData.storageLocation}
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 py-2.5 px-3.5 text-gray-900 dark:text-white dark:bg-gray-800 shadow-sm dark:ring-gray-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Finder's Information */}
            <div className="pb-6 border-b border-gray-200/10">
              <h2 className="text-xl font-semibold leading-7 text-gray-900 dark:text-white">
                Finder's Information
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-500">
                How can we reach you if we need more details or for owner
                verification?
              </p>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                  >
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      autoComplete="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 py-2.5 px-3.5 text-gray-900 dark:text-white dark:bg-gray-800 shadow-sm dark:ring-gray-700 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                  >
                    Email address <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 py-2.5 px-3.5 text-gray-900 dark:text-white dark:bg-gray-800 shadow-sm dark:ring-gray-700 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                  >
                    Phone Number
                  </label>
                  <div className="mt-2">
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 py-2.5 px-3.5 text-gray-900 dark:text-white dark:bg-gray-800 shadow-sm dark:ring-gray-700 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="usn"
                    className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                  >
                    USN (University Seat Number){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-2">
                    <input
                      id="usn"
                      name="usn"
                      type="text"
                      required
                      value={formData.usn}
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 py-2.5 px-3.5 text-gray-900 dark:text-white dark:bg-gray-800 shadow-sm dark:ring-gray-700 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="department"
                    className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                  >
                    Department
                  </label>
                  <div className="mt-2">
                    <input
                      id="department"
                      name="department"
                      type="text"
                      placeholder="e.g., Computer Science"
                      value={formData.department}
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 py-2.5 px-3.5 text-gray-900 dark:text-white dark:bg-gray-800 shadow-sm dark:ring-gray-700 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="semester"
                    className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
                  >
                    Semester
                  </label>
                  <div className="mt-2">
                    <select
                      id="semester"
                      name="semester"
                      value={formData.semester}
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 py-2.5 px-3.5 text-gray-900 dark:text-white dark:bg-gray-800 shadow-sm dark:ring-gray-700 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    >
                      <option value="">Select Semester</option>
                      {["1", "2", "3", "4", "5", "6", "7", "8"].map((sem) => (
                        <option key={sem} value={sem}>
                          {sem} Semester
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
              <button
                type="button"
                onClick={() => setIsPreview(true)}
                className="inline-flex items-center gap-2 text-sm font-semibold leading-6 text-gray-900 dark:text-white hover:text-indigo-600 transition-colors"
              >
                <Eye className="h-4 w-4" />
                Preview Post
              </button>
              <button
                type="submit"
                className="rounded-xl bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
              >
                Submit Report
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Preview Layout
              </h2>
              <button
                onClick={() => setIsPreview(false)}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-600 underline underline-offset-4"
              >
                Edit Details
              </button>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="p-1 max-w-sm mx-auto my-4 w-full aspect-[4/3] rounded-lg bg-gray-100 overflow-hidden relative border border-gray-200">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Item Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-500">
                    No image provided
                  </div>
                )}
                <div className="absolute top-3 left-3 bg-emerald-100/90 text-emerald-800 ring-1 ring-inset ring-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-medium ">
                  Found
                </div>
              </div>

              <div className="p-6 md:p-8">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-indigo-600 px-2.5 py-0.5 rounded-full bg-indigo-600 text-white">
                    {formData.category || "Uncategorized"}
                  </span>
                  <span className="text-sm text-gray-500">
                    {formData.dateFound || "Unknown date"}
                  </span>
                </div>

                <h3 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
                  {formData.itemName || "Untitled Item"}
                </h3>

                <div className="mt-6 flex flex-col gap-4 border-y border-gray-200 py-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Brand</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formData.brand || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Color</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formData.color || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Found Location</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formData.locationFound || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Current Status</p>
                      <p className="font-medium text-indigo-600">
                        {formData.status}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-500">Stored At</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formData.storageLocation || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Description
                  </h4>
                  <p className="text-gray-500 leading-relaxed whitespace-pre-wrap">
                    {formData.description || "No description provided."}
                  </p>
                </div>

                {formData.uniqueIdentifiers && (
                  <div className="mt-4 rounded-lg bg-amber-50 p-4 border border-amber-100">
                    <h4 className="text-sm font-semibold text-amber-800 flex items-center gap-2">
                      Unique Identifiers (Hidden from public view)
                    </h4>
                    <p className="text-amber-700 text-sm mt-1">
                      {formData.uniqueIdentifiers}
                    </p>
                  </div>
                )}

                <div className="mt-8 bg-white p-4 rounded-xl">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wider">
                    Finder Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Name</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formData.name || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">USN</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formData.usn || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Department</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formData.department || "N/A"}{" "}
                        {formData.semester ? `(Sem ${formData.semester})` : ""}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-x-4">
              <button
                onClick={() => setIsPreview(false)}
                className="text-sm font-semibold leading-6 text-gray-900 dark:text-white px-4 py-2 hover:bg-white rounded-lg transition-colors"
              >
                Back to Edit
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="rounded-xl bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors disabled:opacity-75"
              >
                {isSubmitting ? "Submitting..." : "Confirm & Submit"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
