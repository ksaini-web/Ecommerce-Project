import { memo } from 'react';
import { FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

function Alert({ type = 'error', message }) {
  if (!message) return null;

  const tone =
    type === 'success'
      ? 'border-green-200 bg-green-50 text-green-700'
      : 'border-red-200 bg-red-50 text-red-700';
  const Icon = type === 'success' ? FiCheckCircle : FiAlertCircle;

  return (
    <div className={`flex items-start gap-2 rounded-lg border px-4 py-3 text-sm shadow-sm ${tone}`} role="status">
      <Icon className="mt-0.5 shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}

export default memo(Alert);

