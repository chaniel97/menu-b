"use client";

interface ConfirmModalProps {
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  message,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm px-6">
      <div className="w-full max-w-xs bg-white rounded-[20px] shadow-xl p-6 flex flex-col gap-4">
        <p className="text-gray-800 font-medium text-center leading-snug">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-card border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-card bg-red-500 text-white font-semibold text-sm hover:bg-red-600 transition-colors"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
