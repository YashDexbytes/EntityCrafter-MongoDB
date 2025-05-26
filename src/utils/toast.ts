import toast from 'react-hot-toast';

/**
 * Common Toaster component configuration
 */
export const toasterConfig = {
  position: "top-right" as const,
  toastOptions: {
    duration: 2000,
    style: { background: 'white', color: 'black' },
    success: { duration: 2000, style: { background: 'white', color: 'black' } },
    error: { duration: 2000, style: { background: 'white', color: 'black' } }
  }
};

/**
 * Custom toast function to ensure only one toast at a time
 * @param message - The message to display in the toast
 * @param type - The type of toast ('success' or 'error')
 */
export const showToast = (message: string, type: 'success' | 'error') => {
  // Dismiss all existing toasts first
  toast.dismiss();
  // Show new toast
  if (type === 'success') {
    toast.success(message, {
      duration: 3000,
      position: 'top-right',
    });
  } else {
    toast.error(message, {
      duration: 3000,
      position: 'top-right',
    });
  }
}; 