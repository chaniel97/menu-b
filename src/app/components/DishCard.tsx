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

const CATEGORY_STYLES: Record<string, { bg: string; text: string; emoji: string }> = {
  Breakfast: { bg: "bg-amber-100",   text: "text-amber-700",  emoji: "🌅" },
  Lunch:     { bg: "bg-sky-100",     text: "text-sky-700",    emoji: "🥙" },
  Dinner:    { bg: "bg-violet-100",  text: "text-violet-700", emoji: "🍽️" },
  Snack:     { bg: "bg-lime-100",    text: "text-lime-700",   emoji: "🍿" },
  Dessert:   { bg: "bg-pink-100",    text: "text-pink-600",   emoji: "🍰" },
};

export default function DishCard({
  dish, inOrder, selectMode, selected,
  onAddToOrder, onDelete: _onDelete, onToggleSelect, onOpen,
}: DishCardProps) {
  const style = CATEGORY_STYLES[dish.category] ?? { bg: "bg-gray-100", text: "text-gray-600", emoji: "🍴" };

  return (
    <div
      className={`bg-white rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col transition-all active:scale-[0.98] ${
        selectMode ? "cursor-pointer" : "cursor-pointer"
      } ${selected ? "ring-2 ring-[#e8637a] ring-offset-2" : ""}`}
      onClick={selectMode ? () => onToggleSelect(dish.id) : () => onOpen(dish)}
    >
      {/* Photo */}
      <div className="relative w-full h-52 bg-gradient-to-br from-[#fde8ed] to-[#fdf0e0]">
        {dish.photoPath ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={dish.photoPath} alt={dish.name} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl select-none">
            {style.emoji}
          </div>
        )}

        {/* Category badge on photo */}
        <span className={`absolute top-3 left-3 flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${style.bg} ${style.text} shadow-sm`}>
          {style.emoji} {dish.category}
        </span>

        {selectMode && (
          <div className="absolute top-3 right-3 w-7 h-7 rounded-full border-2 border-white shadow flex items-center justify-center bg-white">
            {selected
              ? <span className="w-5 h-5 rounded-full bg-[#e8637a] flex items-center justify-center text-white text-xs">✓</span>
              : <span className="w-5 h-5 rounded-full border-2 border-gray-300 block" />}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-playfair font-bold text-gray-800 text-lg leading-tight">
            {dish.name}
          </h3>
          {dish.cuisine && (
            <span className="flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full bg-[#fef3e2] text-[#c8953a]">
              {dish.cuisine}
            </span>
          )}
        </div>

        {dish.description && (
          <p className="text-gray-400 text-sm leading-snug line-clamp-2">{dish.description}</p>
        )}

        <div className="flex items-center justify-between mt-auto pt-1">
          <StarRating value={dish.rating} readonly />
          {dish.requestCount > 0 && (
            <span className="text-xs text-[#e8637a] font-medium">
              🔁 {dish.requestCount}×
            </span>
          )}
        </div>

        {!selectMode && (
          <button
            onClick={(e) => { e.stopPropagation(); onAddToOrder(dish); }}
            className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all ${
              inOrder
                ? "bg-[#fde8ed] text-[#e8637a] border-2 border-[#e8637a]"
                : "bg-gradient-to-r from-[#e8637a] to-[#f07c8f] text-white shadow-md hover:shadow-lg hover:scale-[1.02]"
            }`}
          >
            {inOrder ? "✓ Added to request" : "＋ Add to request"}
          </button>
        )}
      </div>
    </div>
  );
}
