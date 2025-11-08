import API from "../services/api";
import { useState } from "react";
import { toast } from "sonner";

const DeleteConfirmModal = ({ quoteId, onClose, onDelete }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await API.delete(`${import.meta.env.VITE_API_URL}/api/quotes/${quoteId}`);
      onDelete(quoteId);
      onClose();

      toast.success("Quote deleted successfully 🗑️");

    } catch (err) {
      console.error("Error deleting quote:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-80 text-center shadow-xl">
        <h2 className="text-lg font-semibold mb-4">Delete this quote?</h2>
        <p className="text-gray-600 mb-5">This action cannot be undone.</p>
        <div className="flex justify-center gap-3">
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-md border"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-1 bg-red-600 text-white rounded-md"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
