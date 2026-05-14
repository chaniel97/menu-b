"use client";

interface StarRatingProps {
  value: number;
  onChange?: (val: number) => void;
  readonly?: boolean;
}

export default function StarRating({ value, onChange, readonly = false }: StarRatingProps) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={readonly ? "button" : "button"}
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={`text-lg leading-none transition-transform ${
            readonly ? "cursor-default" : "hover:scale-110 cursor-pointer"
          }`}
        >
          <span className={star <= value ? "text-[#c8953a]" : "text-gray-300"}>★</span>
        </button>
      ))}
    </div>
  );
}
