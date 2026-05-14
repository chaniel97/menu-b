"use client";

const CATEGORIES = ["Breakfast", "Lunch", "Dinner", "Snack", "Dessert"];

interface CategoryFilterProps {
  selected: string[];
  onChange: (cats: string[]) => void;
}

export default function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  function toggle(cat: string) {
    if (cat === "All") {
      onChange([]);
      return;
    }
    const next = selected.includes(cat)
      ? selected.filter((c) => c !== cat)
      : [...selected, cat];
    onChange(next);
  }

  const allActive = selected.length === 0;

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide px-4">
      <button
        onClick={() => toggle("All")}
        className={`flex-shrink-0 px-4 py-1.5 rounded-pill text-sm font-medium transition-all ${
          allActive
            ? "bg-[#e8637a] text-white shadow-sm"
            : "bg-white text-gray-500 border border-gray-200 hover:border-[#e8637a] hover:text-[#e8637a]"
        }`}
      >
        All
      </button>
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => toggle(cat)}
          className={`flex-shrink-0 px-4 py-1.5 rounded-pill text-sm font-medium transition-all ${
            selected.includes(cat)
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
