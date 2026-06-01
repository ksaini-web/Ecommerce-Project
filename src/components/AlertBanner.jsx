import { useEffect } from 'react';

function AlertBanner({ type = 'info', message, onDismiss }) {
  useEffect(() => {
    if (!message || !onDismiss || type === 'error') return undefined;

    const timer = window.setTimeout(onDismiss, 3000);
    return () => window.clearTimeout(timer);
  }, [message, onDismiss, type]);

  if (!message) return null;

  const styles = {
    success: 'bg-green-50 border border-green-200 text-success rounded-lg px-4 py-3 text-sm flex items-center gap-2',
    error: 'bg-red-50 border border-red-200 text-danger rounded-lg px-4 py-3 text-sm flex items-center gap-2',
    info: 'bg-indigo-50 border border-indigo-200 text-primary rounded-lg px-4 py-3 text-sm flex items-center gap-2',
  };

  return (
    <div className={styles[type] || styles.info} role="status">
      <span>{type === 'success' ? '✓' : type === 'error' ? '!' : 'i'}</span>
      <p className="flex-1">{message}</p>
      {onDismiss && (
        <button type="button" className="text-current" onClick={onDismiss} aria-label="Dismiss">
          ×
        </button>
      )}
    </div>
  );
}

export default AlertBanner;

