"use client";

import Image from "next/image";
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
  createdAt: string;
}

interface DishCardProps {
  dish: Dish;
  inOrder: boolean;
  onAddToOrder: (dish: Dish) => void;
  onDelete: (id: number) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  Breakfast: "bg-amber-100 text-amber-700",
  Lunch: "bg-sky-100 text-sky-700",
  Dinner: "bg-indigo-100 text-indigo-700",
  Snack: "bg-purple-100 text-purple-700",
  Dessert: "bg-pink-100 text-pink-700",
};

export default function DishCard({ dish, inOrder, onAddToOrder, onDelete }: DishCardProps) {
  const tagColor = CATEGORY_COLORS[dish.category] || "bg-gray-100 text-gray-600";

  return (
    <div className="bg-white rounded-card shadow-card overflow-hidden flex flex-col transition-shadow hover:shadow-card-hover">
      <div className="relative w-full h-44 bg-[#f5ede3]">
        {dish.photoPath ? (
          <Image
            src={dish.photoPath}
            alt={dish.name}
            fill
            className="object-cover"
            sizes="(max-width: 420px) 100vw, 420px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl select-none">
            🍽️
          </div>
        )}
        <button
          onClick={() => onDelete(dish.id)}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-white transition-colors text-sm shadow-sm"
          aria-label="Delete dish"
        >
          ✕
        </button>
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

        <StarRating value={dish.rating} readonly />

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
      </div>
    </div>
  );
}
