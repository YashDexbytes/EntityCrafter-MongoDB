import { X } from 'lucide-react';
import React, { useState, useEffect } from 'react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export default function DeleteConfirmationModal({ isOpen, onClose, onConfirm }: DeleteConfirmationModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Clear error when modal opens
  useEffect(() => {
    if (isOpen) {
      setError(null);
    }
  }, [isOpen]);

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await onConfirm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while deleting the record');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="relative bg-white dark:bg-boxdark rounded-lg w-96 p-6 z-[100000]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-black dark:text-white">Confirm Delete</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={24} />
          </button>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Are you sure you want to delete this record? This action cannot be undone.
        </p>
        {error && (
          <div className="mb-4 p-3 bg-danger/10 text-danger rounded-md text-sm">
            {error}
          </div>
        )}
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="px-4 py-2 bg-danger text-white rounded hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}