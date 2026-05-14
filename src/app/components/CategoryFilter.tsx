"use client";

const CATEGORIES: { label: string; emoji: string }[] = [
  { label: "All", emoji: "✨" },
  { label: "Breakfast", emoji: "🌅" },
  { label: "Lunch", emoji: "🥙" },
  { label: "Dinner", emoji: "🍽️" },
  { label: "Snack", emoji: "🍿" },
  { label: "Dessert", emoji: "🍰" },
];

interface CategoryFilterProps {
  selected: string[];
  onChange: (cats: string[]) => void;
}

export default function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  function toggle(cat: string) {
    if (cat === "All") { onChange([]); return; }
    const next = selected.includes(cat)
      ? selected.filter((c) => c !== cat)
      : [...selected, cat];
    onChange(next);
  }

  const allActive = selected.length === 0;

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide px-4">
      {CATEGORIES.map(({ label, emoji }) => {
        const isActive = label === "All" ? allActive : selected.includes(label);
        return (
          <button
            key={label}
            onClick={() => toggle(label)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-pill text-sm font-semibold transition-all ${
              isActive
                ? "bg-[#e8637a] text-white shadow-md scale-105"
                : "bg-white text-gray-500 border border-gray-200 hover:border-[#e8637a] hover:text-[#e8637a]"
            }`}
          >
            <span>{emoji}</span>
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
