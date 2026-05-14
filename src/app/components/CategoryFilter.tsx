"use client";

const CATEGORIES = [
  "All",
  "Breakfast",
  "Lunch",
  "Dinner",
  "Snack",
  "Dessert",
];

interface CategoryFilterProps {
  selected: string;
  onChange: (cat: string) => void;
}

export default function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide px-4">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`flex-shrink-0 px-4 py-1.5 rounded-pill text-sm font-medium transition-all ${
            selected === cat
              ? "bg-[#e8637a] text-white shadow-sm"
              : "bg-white text-gray-500 border border-gray-200 hover:border-[#e8637a] hover:text-[#e8637a]"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
