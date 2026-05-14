"use client";

import { useEffect, useState, useCallback } from "react";
import DishCard, { Dish } from "./components/DishCard";
import CategoryFilter from "./components/CategoryFilter";
import AddDishModal from "./components/AddDishModal";
import OrderDrawer from "./components/OrderDrawer";

export default function MenuPage() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [showAdd, setShowAdd] = useState(false);
  const [showOrder, setShowOrder] = useState(false);
  const [orderItems, setOrderItems] = useState<Dish[]>([]);

  const fetchDishes = useCallback(async () => {
    const res = await fetch("/api/dishes");
    const data = await res.json();
    setDishes(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchDishes();
  }, [fetchDishes]);

  const filtered =
    category === "All" ? dishes : dishes.filter((d) => d.category === category);

  function handleAddToOrder(dish: Dish) {
    setOrderItems((prev) =>
      prev.find((d) => d.id === dish.id) ? prev : [...prev, dish]
    );
  }

  function handleRemoveFromOrder(id: number) {
    setOrderItems((prev) => prev.filter((d) => d.id !== id));
  }

  async function handleDelete(id: number) {
    await fetch(`/api/dishes/${id}`, { method: "DELETE" });
    setDishes((prev) => prev.filter((d) => d.id !== id));
    setOrderItems((prev) => prev.filter((d) => d.id !== id));
  }

  return (
    <div className="flex flex-col min-h-dvh pb-24">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#fdf8f3]/90 backdrop-blur-md px-4 pt-5 pb-3 border-b border-[#f0e4d8]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="font-playfair text-2xl font-bold text-gray-800 leading-tight">
              Her Kitchen 💕
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {dishes.length} {dishes.length === 1 ? "dish" : "dishes"} saved
            </p>
          </div>
          {orderItems.length > 0 && (
            <button
              onClick={() => setShowOrder(true)}
              className="relative flex items-center gap-1.5 bg-[#e8637a] text-white text-sm font-semibold px-3.5 py-2 rounded-pill shadow-fab hover:bg-[#c94860] transition-colors"
            >
              <span>Order</span>
              <span className="bg-white text-[#e8637a] w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">
                {orderItems.length}
              </span>
            </button>
          )}
        </div>
        <CategoryFilter selected={category} onChange={setCategory} />
      </header>

      {/* Grid */}
      <main className="flex-1 px-4 pt-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 mt-20 text-gray-400">
            <span className="text-4xl animate-pulse">🍳</span>
            <span className="text-sm">Loading the menu…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 mt-20 text-center">
            <span className="text-5xl">🍽️</span>
            <p className="font-playfair text-xl font-semibold text-gray-700">No dishes yet</p>
            <p className="text-sm text-gray-400 max-w-xs">
              {category !== "All"
                ? `No ${category} dishes added. Try a different category or add one!`
                : "Tap the + button to add your first dish."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filtered.map((dish) => (
              <DishCard
                key={dish.id}
                dish={dish}
                inOrder={!!orderItems.find((d) => d.id === dish.id)}
                onAddToOrder={handleAddToOrder}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      {/* FAB — pinned bottom-right within the 420px column */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-app pointer-events-none z-40">
        <button
          onClick={() => setShowAdd(true)}
          className="absolute bottom-6 right-4 pointer-events-auto w-14 h-14 rounded-full bg-[#e8637a] text-white text-3xl flex items-center justify-center shadow-fab hover:bg-[#c94860] active:scale-95 transition-all"
          aria-label="Add dish"
        >
          +
        </button>
      </div>

      {showAdd && (
        <AddDishModal
          onClose={() => setShowAdd(false)}
          onAdded={() => {
            setShowAdd(false);
            fetchDishes();
          }}
        />
      )}

      {showOrder && (
        <OrderDrawer
          items={orderItems}
          onRemove={handleRemoveFromOrder}
          onClose={() => setShowOrder(false)}
        />
      )}
    </div>
  );
}
