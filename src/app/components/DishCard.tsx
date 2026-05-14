"use client";

import StarRating from "./StarRating";

export interface Dish {
  id: number;
  name: string;
  description: string | null;
  category: string;
  cuisine: string | null;
  rating: number;
  photoPath: string | null;
  notes: string | null;
  requestCount: number;
  createdAt: string;
}

interface DishCardProps {
  dish: Dish;
  inOrder: boolean;
  selectMode: boolean;
  selected: boolean;
  onAddToOrder: (dish: Dish) => void;
  onDelete: (dish: Dish) => void;
  onToggleSelect: (id: number) => void;
  onOpen: (dish: Dish) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  Breakfast: "bg-amber-100 text-amber-700",
  Lunch: "bg-sky-100 text-sky-700",
  Dinner: "bg-indigo-100 text-indigo-700",
  Snack: "bg-purple-100 text-purple-700",
  Dessert: "bg-pink-100 text-pink-700",
};

export default function DishCard({
  dish,
  inOrder,
  selectMode,
  selected,
  onAddToOrder,
  onDelete,
  onToggleSelect,
  onOpen,
}: DishCardProps) {
  const tagColor = CATEGORY_COLORS[dish.category] || "bg-gray-100 text-gray-600";

  return (
    <div
      className={`bg-white rounded-card shadow-card overflow-hidden flex flex-col transition-all ${
        selectMode ? "cursor-pointer" : "cursor-pointer hover:shadow-card-hover"
      } ${selected ? "ring-2 ring-[#e8637a]" : ""}`}
      onClick={selectMode ? () => onToggleSelect(dish.id) : () => onOpen(dish)}
    >
      <div className="relative w-full h-44 bg-[#f5ede3]">
        {dish.photoPath ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={dish.photoPath} alt={dish.name} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl select-none">
            🍽️
          </div>
        )}

        {selectMode && (
          <div className="absolute top-2 left-2 w-7 h-7 rounded-full border-2 border-white shadow flex items-center justify-center bg-white">
            {selected ? (
              <span className="w-5 h-5 rounded-full bg-[#e8637a] flex items-center justify-center text-white text-xs">✓</span>
            ) : (
              <span className="w-5 h-5 rounded-full border-2 border-gray-300 block" />
            )}
          </div>
        )}
      </div>

      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-playfair font-semibold text-gray-800 text-base leading-tight">
            {dish.name}
          </h3>
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-pill ${tagColor}`}>
              {dish.category}
            </span>
            {dish.cuisine && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-pill bg-[#f5e6cc] text-[#c8953a]">
                {dish.cuisine}
              </span>
            )}
          </div>
        </div>

        {dish.description && (
          <p className="text-gray-500 text-sm leading-snug line-clamp-2">{dish.description}</p>
        )}

        <div className="flex items-center justify-between">
          <StarRating value={dish.rating} readonly />
          {dish.requestCount > 0 && (
            <span className="text-xs text-gray-400">
              Requested {dish.requestCount}×
            </span>
          )}
        </div>

        {!selectMode && (
          <button
            onClick={() => onAddToOrder(dish)}
            className={`mt-auto w-full py-2 rounded-card text-sm font-semibold transition-all ${
              inOrder
                ? "bg-[#f9d5db] text-[#c94860] border border-[#e8637a]"
                : "bg-[#e8637a] text-white hover:bg-[#c94860] shadow-sm"
            }`}
          >
            {inOrder ? "✓ Added to request" : "+ Add to request"}
          </button>
        )}
      </div>
    </div>
  );
}
