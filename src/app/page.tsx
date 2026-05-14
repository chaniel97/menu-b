"use client";

import { useEffect, useState, useCallback } from "react";
import DishCard, { Dish } from "./components/DishCard";
import CategoryFilter from "./components/CategoryFilter";
import AddDishModal from "./components/AddDishModal";
import OrderDrawer from "./components/OrderDrawer";
import ConfirmModal from "./components/ConfirmModal";
import DishDetailModal from "./components/DishDetailModal";

export default function MenuPage() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showOrder, setShowOrder] = useState(false);
  const [orderItems, setOrderItems] = useState<Dish[]>([]);

  // detail modal
  const [activeDish, setActiveDish] = useState<Dish | null>(null);

  // delete confirmation (bulk only — single delete lives in detail modal)
  const [pendingDelete, setPendingDelete] = useState<Dish | null>(null);

  // multi-select delete
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [pendingBulkDelete, setPendingBulkDelete] = useState(false);

  const fetchDishes = useCallback(async () => {
    const res = await fetch("/api/dishes");
    const data = await res.json();
    setDishes(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchDishes();
  }, [fetchDishes]);

  const filtered = dishes.filter((d) => {
    const matchesCategory = categories.length === 0 || categories.includes(d.category);
    const matchesSearch =
      !search.trim() ||
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.description?.toLowerCase().includes(search.toLowerCase()) ||
      d.cuisine?.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  function handleAddToOrder(dish: Dish) {
    setOrderItems((prev) =>
      prev.find((d) => d.id === dish.id)
        ? prev.filter((d) => d.id !== dish.id)
        : [...prev, dish]
    );
  }

  function handleRemoveFromOrder(id: number) {
    setOrderItems((prev) => prev.filter((d) => d.id !== id));
  }

  function handleToggleSelect(id: number) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    await fetch(`/api/dishes/${pendingDelete.id}`, { method: "DELETE" });
    setDishes((prev) => prev.filter((d) => d.id !== pendingDelete.id));
    setOrderItems((prev) => prev.filter((d) => d.id !== pendingDelete.id));
    setPendingDelete(null);
  }

  async function confirmBulkDelete() {
    await Promise.all(
      [...selectedIds].map((id) => fetch(`/api/dishes/${id}`, { method: "DELETE" }))
    );
    setDishes((prev) => prev.filter((d) => !selectedIds.has(d.id)));
    setOrderItems((prev) => prev.filter((d) => !selectedIds.has(d.id)));
    setSelectedIds(new Set());
    setSelectMode(false);
    setPendingBulkDelete(false);
  }

  function exitSelectMode() {
    setSelectMode(false);
    setSelectedIds(new Set());
  }

  return (
    <div className="flex flex-col min-h-dvh" style={{ paddingBottom: "calc(7rem + env(safe-area-inset-bottom))" }}>
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#fdf8f3]/90 backdrop-blur-md px-4 sm:px-6 pt-4 pb-3 border-b border-[#f0e4d8]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="font-playfair text-2xl font-bold leading-tight bg-gradient-to-r from-[#e8637a] to-[#c8953a] bg-clip-text text-transparent">
              🍴 MenuB
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {dishes.length} {dishes.length === 1 ? "dish" : "dishes"} saved ✨
            </p>
          </div>
          <div className="flex items-center gap-2">
            {selectMode ? (
              <button
                onClick={exitSelectMode}
                className="text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors px-2"
              >
                Cancel
              </button>
            ) : (
              <button
                onClick={() => setSelectMode(true)}
                className="text-sm font-semibold text-gray-500 hover:text-[#e8637a] transition-colors px-2"
              >
                Select
              </button>
            )}
            {!selectMode && orderItems.length > 0 && (
              <button
                onClick={() => setShowOrder(true)}
                className="flex items-center gap-1.5 bg-gradient-to-r from-[#e8637a] to-[#f07c8f] text-white text-sm font-bold px-3.5 py-2 rounded-pill shadow-fab hover:shadow-lg transition-all"
              >
                <span>Order</span>
                <span className="bg-white text-[#e8637a] w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">
                  {orderItems.length}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-2">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search dishes, cuisine…"
            className="w-full pl-9 pr-4 py-2 rounded-card bg-white border border-gray-200 text-sm focus:outline-none focus:border-[#e8637a] focus:ring-1 focus:ring-[#e8637a]/30 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
            >
              ✕
            </button>
          )}
        </div>

        <CategoryFilter selected={categories} onChange={setCategories} />
      </header>

      {/* Grid */}
      <main className="flex-1 px-4 sm:px-6 pt-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 mt-20 text-gray-400">
            <span className="text-4xl animate-pulse">🍳</span>
            <span className="text-sm">Loading the menu…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 mt-20 text-center">
            <span className="text-5xl">🍽️</span>
            <p className="font-playfair text-xl font-semibold text-gray-700">No dishes found</p>
            <p className="text-sm text-gray-400 max-w-xs">
              {search
                ? `No results for "${search}".`
                : categories.length > 0
                ? `No ${categories.join(" or ")} dishes yet.`
                : "Tap the + button to add your first dish."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map((dish) => (
              <DishCard
                key={dish.id}
                dish={dish}
                inOrder={!!orderItems.find((d) => d.id === dish.id)}
                selectMode={selectMode}
                selected={selectedIds.has(dish.id)}
                onAddToOrder={handleAddToOrder}
                onDelete={(d) => setPendingDelete(d)}
                onToggleSelect={handleToggleSelect}
                onOpen={(d) => setActiveDish(d)}
              />
            ))}
          </div>
        )}
      </main>

      {/* FAB */}
      {!selectMode && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg pointer-events-none z-40">
          <button
            onClick={() => setShowAdd(true)}
            style={{ bottom: "calc(1.5rem + env(safe-area-inset-bottom))" }}
            className="absolute right-4 sm:right-6 pointer-events-auto w-14 h-14 rounded-full bg-gradient-to-br from-[#e8637a] to-[#f07c8f] text-white text-3xl flex items-center justify-center shadow-fab hover:shadow-xl active:scale-95 transition-all"
            aria-label="Add dish"
          >
            +
          </button>
        </div>
      )}

      {/* Bulk delete bar */}
      {selectMode && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg z-40 px-4 sm:px-6 pt-3 bg-gradient-to-t from-[#fdf8f3] to-transparent"
          style={{ paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom))" }}
        >
          <button
            disabled={selectedIds.size === 0}
            onClick={() => setPendingBulkDelete(true)}
            className="w-full py-3 rounded-card bg-red-500 text-white font-semibold text-sm hover:bg-red-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-fab"
          >
            {selectedIds.size === 0
              ? "Select dishes to delete"
              : `Delete ${selectedIds.size} ${selectedIds.size === 1 ? "dish" : "dishes"}`}
          </button>
        </div>
      )}

      {showAdd && (
        <AddDishModal
          onClose={() => setShowAdd(false)}
          onAdded={() => { setShowAdd(false); fetchDishes(); }}
        />
      )}

      {showOrder && (
        <OrderDrawer
          items={orderItems}
          onRemove={handleRemoveFromOrder}
          onClose={() => { setShowOrder(false); fetchDishes(); }}
        />
      )}

      {pendingDelete && (
        <ConfirmModal
          message={`Delete "${pendingDelete.name}"? This can't be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}

      {pendingBulkDelete && (
        <ConfirmModal
          message={`Delete ${selectedIds.size} ${selectedIds.size === 1 ? "dish" : "dishes"}? This can't be undone.`}
          confirmLabel={`Delete ${selectedIds.size}`}
          onConfirm={confirmBulkDelete}
          onCancel={() => setPendingBulkDelete(false)}
        />
      )}

      {activeDish && (
        <DishDetailModal
          dish={activeDish}
          inOrder={!!orderItems.find((d) => d.id === activeDish.id)}
          onClose={() => setActiveDish(null)}
          onAddToOrder={handleAddToOrder}
          onUpdated={(updated) => {
            setDishes((prev) => prev.map((d) => d.id === updated.id ? updated : d));
            setActiveDish(updated);
          }}
          onDeleted={(id) => {
            setDishes((prev) => prev.filter((d) => d.id !== id));
            setOrderItems((prev) => prev.filter((d) => d.id !== id));
            setActiveDish(null);
          }}
        />
      )}
    </div>
  );
}
