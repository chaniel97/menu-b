"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import StarRating from "./StarRating";

const CATEGORIES = ["Breakfast", "Lunch", "Dinner", "Snack", "Dessert"];

const CUISINES = [
  "Filipino",
  "Italian",
  "Japanese",
  "Chinese",
  "Korean",
  "Thai",
  "Vietnamese",
  "Mexican",
  "Indian",
  "American",
  "French",
  "Mediterranean",
  "Spanish",
  "Greek",
  "Middle Eastern",
  "Other",
];

interface AddDishModalProps {
  onClose: () => void;
  onAdded: () => void;
}

export default function AddDishModal({ onClose, onAdded }: AddDishModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Dinner");
  const [cuisine, setCuisine] = useState("");
  const [rating, setRating] = useState(3);
  const [notes, setNotes] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [photoPath, setPhotoPath] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.path) setPhotoPath(data.path);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      await fetch("/api/dishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, category, cuisine: cuisine || null, rating, photoPath, notes }),
      });
      onAdded();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg bg-[#fdf8f3] rounded-t-[24px] max-h-[92dvh] overflow-y-auto">
        <div className="flex items-center justify-between px-4 sm:px-6 pt-5 pb-3">
          <h2 className="font-playfair text-xl font-bold text-gray-800">Add a new dish</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-4 sm:px-6 flex flex-col gap-4" style={{ paddingBottom: "calc(2rem + env(safe-area-inset-bottom))" }}>
          {/* Photo */}
          <div
            onClick={() => fileRef.current?.click()}
            className="relative w-full h-40 rounded-card bg-[#f5ede3] border-2 border-dashed border-[#e8c4b0] flex items-center justify-center cursor-pointer overflow-hidden hover:border-[#e8637a] transition-colors"
          >
            {preview ? (
              <Image src={preview} alt="preview" fill className="object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-1 text-[#c8953a]">
                <span className="text-3xl">📷</span>
                <span className="text-sm font-medium">Tap to add photo</span>
              </div>
            )}
            {uploading && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                <span className="text-sm text-[#e8637a] font-medium">Uploading…</span>
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

          {/* Name */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Dish name *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Creamy Carbonara"
              required
              className="border border-gray-200 rounded-card px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-[#e8637a] focus:ring-1 focus:ring-[#e8637a]/30 transition-colors"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What makes this dish special?"
              rows={2}
              className="border border-gray-200 rounded-card px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-[#e8637a] focus:ring-1 focus:ring-[#e8637a]/30 resize-none transition-colors"
            />
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-pill text-sm font-medium transition-all ${
                    category === cat
                      ? "bg-[#e8637a] text-white"
                      : "bg-white border border-gray-200 text-gray-500 hover:border-[#e8637a] hover:text-[#e8637a]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Cuisine */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Cuisine <span className="text-gray-400 font-normal">(optional)</span></label>
            <div className="flex flex-wrap gap-2">
              {CUISINES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCuisine(cuisine === c ? "" : c)}
                  className={`px-3 py-1.5 rounded-pill text-sm font-medium transition-all ${
                    cuisine === c
                      ? "bg-[#c8953a] text-white"
                      : "bg-white border border-gray-200 text-gray-500 hover:border-[#c8953a] hover:text-[#c8953a]"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Your rating</label>
            <StarRating value={rating} onChange={setRating} />
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Notes <span className="text-gray-400 font-normal">(optional)</span></label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special requests or memories…"
              rows={2}
              className="border border-gray-200 rounded-card px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-[#e8637a] focus:ring-1 focus:ring-[#e8637a]/30 resize-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={saving || uploading || !name.trim()}
            className="w-full py-3 bg-[#e8637a] text-white font-semibold rounded-card hover:bg-[#c94860] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-fab mt-1"
          >
            {saving ? "Saving…" : "Save dish 💕"}
          </button>
        </form>
      </div>
    </div>
  );
}
