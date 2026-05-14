"use client";

import { useState, useRef } from "react";
import StarRating from "./StarRating";
import ConfirmModal from "./ConfirmModal";
import { Dish } from "./DishCard";

const CATEGORIES = ["Breakfast", "Lunch", "Dinner", "Snack", "Dessert"];
const CUISINES = [
  "Filipino", "Italian", "Japanese", "Chinese", "Korean", "Thai",
  "Vietnamese", "Mexican", "Indian", "American", "French",
  "Mediterranean", "Spanish", "Greek", "Middle Eastern", "Other",
];

const CATEGORY_COLORS: Record<string, string> = {
  Breakfast: "bg-amber-100 text-amber-700",
  Lunch: "bg-sky-100 text-sky-700",
  Dinner: "bg-indigo-100 text-indigo-700",
  Snack: "bg-purple-100 text-purple-700",
  Dessert: "bg-pink-100 text-pink-700",
};

interface DishDetailModalProps {
  dish: Dish;
  inOrder: boolean;
  onClose: () => void;
  onUpdated: (dish: Dish) => void;
  onDeleted: (id: number) => void;
  onAddToOrder: (dish: Dish) => void;
}

function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new window.Image();
      img.onerror = reject;
      img.onload = () => {
        const MAX = 800;
        let w = img.width;
        let h = img.height;
        if (w > MAX || h > MAX) {
          if (w > h) { h = Math.round((h * MAX) / w); w = MAX; }
          else { w = Math.round((w * MAX) / h); h = MAX; }
        }
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.75));
      };
      img.src = e.target!.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export default function DishDetailModal({ dish, inOrder, onClose, onUpdated, onDeleted, onAddToOrder }: DishDetailModalProps) {
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // edit form state
  const [name, setName] = useState(dish.name);
  const [description, setDescription] = useState(dish.description ?? "");
  const [category, setCategory] = useState(dish.category);
  const [cuisine, setCuisine] = useState(dish.cuisine ?? "");
  const [rating, setRating] = useState(dish.rating);
  const [notes, setNotes] = useState(dish.notes ?? "");
  const [photoData, setPhotoData] = useState<string | null>(dish.photoPath ?? null);
  const [compressing, setCompressing] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCompressing(true);
    try {
      const compressed = await compressImage(file);
      setPhotoData(compressed);
    } finally {
      setCompressing(false);
    }
  }

  async function handleSave() {
    if (!name.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/dishes/${dish.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, description, category,
          cuisine: cuisine || null,
          rating, photoPath: photoData || null, notes,
        }),
      });
      const updated = await res.json();
      onUpdated(updated);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    await fetch(`/api/dishes/${dish.id}`, { method: "DELETE" });
    onDeleted(dish.id);
  }

  const tagColor = CATEGORY_COLORS[dish.category] || "bg-gray-100 text-gray-600";
  const editTagColor = CATEGORY_COLORS[category] || "bg-gray-100 text-gray-600";

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="w-full max-w-lg bg-[#fdf8f3] rounded-t-[24px] max-h-[95dvh] overflow-y-auto">

          {/* ── VIEW MODE ── */}
          {!editing && (
            <>
              {/* Photo */}
              <div className="relative w-full h-56 bg-[#f5ede3] rounded-t-[24px] overflow-hidden">
                {dish.photoPath ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={dish.photoPath} alt={dish.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl">🍽️</div>
                )}
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/50 transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="px-4 sm:px-6 pt-4 pb-2" style={{ paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom))" }}>
                {/* Name + tags */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h2 className="font-playfair text-2xl font-bold text-gray-800 leading-tight flex-1">
                    {dish.name}
                  </h2>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0 mt-1">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-pill ${tagColor}`}>
                      {dish.category}
                    </span>
                    {dish.cuisine && (
                      <span className="text-xs font-medium px-2.5 py-1 rounded-pill bg-[#f5e6cc] text-[#c8953a]">
                        {dish.cuisine}
                      </span>
                    )}
                  </div>
                </div>

                <StarRating value={dish.rating} readonly />

                {dish.description && (
                  <p className="text-gray-600 text-sm leading-relaxed mt-3">{dish.description}</p>
                )}

                {dish.notes && (
                  <div className="mt-3 bg-[#f5ede3] rounded-card px-4 py-3">
                    <p className="text-xs font-semibold text-[#c8953a] mb-1">Notes</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{dish.notes}</p>
                  </div>
                )}

                {dish.requestCount > 0 && (
                  <p className="text-xs text-gray-400 mt-3">
                    Requested {dish.requestCount} {dish.requestCount === 1 ? "time" : "times"} 💕
                  </p>
                )}

                {/* Actions */}
                <button
                  onClick={() => onAddToOrder(dish)}
                  className={`w-full mt-5 py-3 rounded-card font-semibold text-sm transition-all ${
                    inOrder
                      ? "bg-[#f9d5db] text-[#c94860] border border-[#e8637a]"
                      : "bg-[#e8637a] text-white hover:bg-[#c94860] shadow-fab"
                  }`}
                >
                  {inOrder ? "✓ Added to request" : "+ Add to request"}
                </button>

                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => setConfirmDelete(true)}
                    className="flex-1 py-2 rounded-card text-red-400 text-sm font-medium hover:text-red-600 transition-colors"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setEditing(true)}
                    className="flex-1 py-2 rounded-card border border-gray-200 text-gray-500 text-sm font-medium hover:border-gray-300 hover:text-gray-700 transition-colors"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </>
          )}

          {/* ── EDIT MODE ── */}
          {editing && (
            <>
              <div className="flex items-center justify-between px-4 sm:px-6 pt-5 pb-3">
                <h2 className="font-playfair text-xl font-bold text-gray-800">Edit dish</h2>
                <button
                  onClick={() => setEditing(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="px-4 sm:px-6 flex flex-col gap-4" style={{ paddingBottom: "calc(2rem + env(safe-area-inset-bottom))" }}>
                {/* Photo */}
                <div
                  onClick={() => fileRef.current?.click()}
                  className="relative w-full h-40 rounded-card bg-[#f5ede3] border-2 border-dashed border-[#e8c4b0] flex items-center justify-center cursor-pointer overflow-hidden hover:border-[#e8637a] transition-colors"
                >
                  {photoData ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={photoData} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-[#c8953a]">
                      <span className="text-3xl">📷</span>
                      <span className="text-sm font-medium">Tap to change photo</span>
                    </div>
                  )}
                  {compressing && (
                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                      <span className="text-sm text-[#e8637a] font-medium">Processing…</span>
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
                    required
                    className="border border-gray-200 rounded-card px-3 py-2.5 bg-white focus:outline-none focus:border-[#e8637a] focus:ring-1 focus:ring-[#e8637a]/30 transition-colors"
                  />
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-gray-700">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    className="border border-gray-200 rounded-card px-3 py-2.5 bg-white focus:outline-none focus:border-[#e8637a] focus:ring-1 focus:ring-[#e8637a]/30 resize-none transition-colors"
                  />
                </div>

                {/* Category */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-gray-700">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                      <button key={cat} type="button" onClick={() => setCategory(cat)}
                        className={`px-3 py-1.5 rounded-pill text-sm font-medium transition-all ${
                          category === cat ? `${editTagColor} ring-2 ring-offset-1 ring-[#e8637a]` : "bg-white border border-gray-200 text-gray-500 hover:border-[#e8637a] hover:text-[#e8637a]"
                        }`}>
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
                      <button key={c} type="button" onClick={() => setCuisine(cuisine === c ? "" : c)}
                        className={`px-3 py-1.5 rounded-pill text-sm font-medium transition-all ${
                          cuisine === c ? "bg-[#c8953a] text-white" : "bg-white border border-gray-200 text-gray-500 hover:border-[#c8953a] hover:text-[#c8953a]"
                        }`}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rating */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-gray-700">Rating</label>
                  <StarRating value={rating} onChange={setRating} />
                </div>

                {/* Notes */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-gray-700">Notes <span className="text-gray-400 font-normal">(optional)</span></label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                    className="border border-gray-200 rounded-card px-3 py-2.5 bg-white focus:outline-none focus:border-[#e8637a] focus:ring-1 focus:ring-[#e8637a]/30 resize-none transition-colors"
                  />
                </div>

                <button
                  onClick={handleSave}
                  disabled={saving || compressing || !name.trim()}
                  className="w-full py-3 bg-[#e8637a] text-white font-semibold rounded-card hover:bg-[#c94860] transition-colors disabled:opacity-50 shadow-fab"
                >
                  {saving ? "Saving…" : "Save changes 💕"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {confirmDelete && (
        <ConfirmModal
          message={`Delete "${dish.name}"? This can't be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
    </>
  );
}
