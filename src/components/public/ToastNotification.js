/**
 * ============================================================================
 * FILE: ToastNotification.js
 * LOCATION: src/components/public/ToastNotification.js
 * PURPOSE: Reusable toast notification component for success/error messages
 * 
 * WHAT THIS FILE DOES:
 * ====================
 * Provides a floating notification that appears regardless of scroll position.
 * Used to show feedback messages (success/error) after form submissions or
 * other user actions.
 * 
 * FEATURES:
 * =========
 * - Fixed position at bottom-right of screen
 * - Smooth fade in/out animation
 * - Success (green) and error (red) styling
 * - Dismiss button to close manually
 * - Auto-dismiss after configurable duration
 * - Accessible with proper ARIA attributes
 * 
 * DEPENDENCIES:
 * =============
 * - React: useState, useEffect, useCallback hooks
 * - TailwindCSS: All styling
 * 
 * PROPS:
 * ======
 * @param {boolean} visible - Whether the toast is visible
 * @param {string} type - 'success' or 'error' for styling
 * @param {string} message - Message to display
 * @param {function} onClose - Callback when toast is dismissed
 * @param {number} duration - Auto-dismiss duration in ms (default 5000, 0 = no auto-dismiss)
 * @param {string} position - Position of toast: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' (default 'bottom-right')
 * 
 * USAGE:
 * ======
 * ```jsx
 * import ToastNotification from '@/components/public/ToastNotification';
 * 
 * // In your component:
 * const [toast, setToast] = useState({ visible: false, type: 'success', message: '' });
 * 
 * const showToast = (type, message) => {
 *   setToast({ visible: true, type, message });
 * };
 * 
 * const hideToast = () => {
 *   setToast(prev => ({ ...prev, visible: false }));
 * };
 * 
 * // In your JSX:
 * <ToastNotification
 *   visible={toast.visible}
 *   type={toast.type}
 *   message={toast.message}
 *   onClose={hideToast}
 *   duration={5000}
 * />
 * ```
 * 
 * ============================================================================
 */

import { useState, useEffect, useCallback } from 'react';

/**
 * POSITION CLASSES
 * 
 * Maps position prop to Tailwind classes
 */
const POSITION_CLASSES = {
  'bottom-right': 'bottom-6 right-6',
  'bottom-left': 'bottom-6 left-6',
  'top-right': 'top-6 right-6',
  'top-left': 'top-6 left-6',
};

/**
 * COMPONENT: ToastNotification
 * 
 * PURPOSE: Display floating notification messages
 */
export default function ToastNotification({
  visible = false,
  type = 'success',
  message = '',
  onClose,
  duration = 5000,
  position = 'bottom-right',
}) {
  // ==========================================================================
  // AUTO-DISMISS EFFECT
  // ==========================================================================
  /**
   * PURPOSE: Automatically hide toast after duration
   * 
   * WHY useEffect:
   * - Need to set timeout when toast becomes visible
   * - Need to clean up timeout if toast is hidden early or component unmounts
   * 
   * BEHAVIOR:
   * - If duration is 0, no auto-dismiss
   * - If duration > 0, dismiss after that many milliseconds
   */
  useEffect(() => {
    if (visible && duration > 0 && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      // Cleanup timeout on unmount or when visibility changes
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);

  // ==========================================================================
  // HANDLERS
  // ==========================================================================
  /**
   * FUNCTION: handleClose
   * 
   * PURPOSE: Handle manual dismiss of toast
   */
  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  // ==========================================================================
  // RENDER
  // ==========================================================================
  /**
   * ANIMATION CLASSES:
   * - opacity-100 translate-y-0: Visible state
   * - opacity-0 translate-y-4: Hidden state (slides down and fades)
   * - pointer-events-none: Prevents interaction when hidden
   * 
   * STYLING:
   * - Success: Green background (bg-green-600)
   * - Error: Red background (bg-red-600)
   * - Both: White text, rounded corners, shadow
   */
  const positionClass = POSITION_CLASSES[position] || POSITION_CLASSES['bottom-right'];

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`fixed ${positionClass} z-50 transition-all duration-300 ease-in-out ${
        visible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${
          type === 'success'
            ? 'bg-green-600 text-white'
            : 'bg-red-600 text-white'
        }`}
      >
        {/* Icon */}
        {type === 'success' ? (
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ) : (
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
        
        {/* Message */}
        <span className="font-medium">{message}</span>
        
        {/* Close button */}
        <button
          type="button"
          onClick={handleClose}
          className="ml-2 p-1 hover:bg-white/20 rounded transition-colors"
          aria-label="Dismiss notification"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/**
 * ============================================================================
 * HOOK: useToast
 * 
 * PURPOSE: Convenience hook for managing toast state
 * 
 * USAGE:
 * ```jsx
 * import { useToast } from '@/components/public/ToastNotification';
 * 
 * function MyComponent() {
 *   const { toast, showToast, hideToast } = useToast();
 *   
 *   const handleSave = async () => {
 *     try {
 *       await saveData();
 *       showToast('success', 'Data saved successfully!');
 *     } catch (error) {
 *       showToast('error', error.message);
 *     }
 *   };
 *   
 *   return (
 *     <>
 *       <button onClick={handleSave}>Save</button>
 *       <ToastNotification {...toast} onClose={hideToast} />
 *     </>
 *   );
 * }
 * ```
 * ============================================================================
 */
export function useToast(defaultDuration = 5000) {
  const [toast, setToast] = useState({
    visible: false,
    type: 'success',
    message: '',
  });

  /**
   * FUNCTION: showToast
   * 
   * PURPOSE: Display toast notification with auto-dismiss
   * 
   * @param {string} type - 'success' or 'error'
   * @param {string} message - Message to display
   * @param {number} duration - How long to show toast (default from hook init)
   */
  const showToast = useCallback((type, message, duration = defaultDuration) => {
    setToast({ visible: true, type, message });
    
    if (duration > 0) {
      setTimeout(() => {
        setToast(prev => ({ ...prev, visible: false }));
      }, duration);
    }
  }, [defaultDuration]);

  /**
   * FUNCTION: hideToast
   * 
   * PURPOSE: Manually hide the toast
   */
  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, visible: false }));
  }, []);

  return {
    toast,
    showToast,
    hideToast,
  };
}
