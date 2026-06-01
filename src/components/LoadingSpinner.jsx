import { memo } from 'react';

function LoadingSpinner({ size = 'md', label = 'Loading' }) {
  const sizeClass = size === 'sm' ? 'h-4 w-4' : 'h-9 w-9';

  return (
    <div className="flex min-h-24 items-center justify-center gap-3 text-primary" role="status" aria-label={label}>
      <span className={`${sizeClass} animate-spin rounded-full border-2 border-current border-t-transparent`} />
      {size !== 'sm' && <span className="text-sm font-medium text-muted">{label}</span>}
    </div>
  );
}

export default memo(LoadingSpinner);

