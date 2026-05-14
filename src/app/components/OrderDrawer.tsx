"use client";

import { useState } from "react";
import { Dish } from "./DishCard";

interface OrderDrawerProps {
  items: Dish[];
  onRemove: (id: number) => void;
  onClose: () => void;
}

export default function OrderDrawer({ items, onRemove, onClose }: OrderDrawerProps) {
  const [copied, setCopied] = useState(false);

  function buildMessage() {
    const list = items.map((d) => `• ${d.name}`).join("\n");
    return `Hey babe 💕 I'd love if you could cook:\n${list}\n\nCan't wait to taste it! 😋`;
  }

  async function logRequest() {
    await fetch("/api/dishes/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: items.map((d) => d.id) }),
    });
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(buildMessage());
    await logRequest();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleShare() {
    if (navigator.share) {
      await navigator.share({ text: buildMessage() });
      await logRequest();
    } else {
      handleCopy();
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg bg-[#fdf8f3] rounded-[28px] max-h-[85dvh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h2 className="font-playfair text-xl font-bold text-gray-800">Your request 💌</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
          >
            ✕
          </button>
        </div>

        {items.length === 0 ? (
          <div className="px-5 pb-10 text-center text-gray-400 text-sm mt-4">
            No dishes added yet. Tap <span className="font-semibold text-[#e8637a]">+ Add to request</span> on a dish!
          </div>
        ) : (
          <div className="px-5 pb-6 flex flex-col gap-4">
            <ul className="flex flex-col gap-2">
              {items.map((dish) => (
                <li
                  key={dish.id}
                  className="flex items-center gap-3 bg-white rounded-card px-3 py-2.5 shadow-card"
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-[#f5ede3]">
                    {dish.photoPath ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={dish.photoPath} alt={dish.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl">🍽️</div>
                    )}
                  </div>
                  <span className="font-medium text-gray-800 text-sm flex-1">{dish.name}</span>
                  <button
                    onClick={() => onRemove(dish.id)}
                    className="text-gray-400 hover:text-red-400 transition-colors text-sm flex-shrink-0"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>

            <div className="bg-[#f9d5db] rounded-card p-4 text-sm text-[#c94860] leading-relaxed whitespace-pre-line">
              {buildMessage()}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCopy}
                className="flex-1 py-2.5 rounded-card border-2 border-[#e8637a] text-[#e8637a] font-semibold text-sm hover:bg-[#f9d5db] transition-colors"
              >
                {copied ? "Copied! ✓" : "Copy message"}
              </button>
              <button
                onClick={handleShare}
                className="flex-1 py-2.5 rounded-card bg-[#e8637a] text-white font-semibold text-sm hover:bg-[#c94860] transition-colors shadow-fab"
              >
                Send to chef 💕
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
