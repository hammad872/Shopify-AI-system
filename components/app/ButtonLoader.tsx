import { Loader2 } from 'lucide-react';

export function ButtonLoader({ label, loadingLabel }: { label: string; loadingLabel?: string }) {
  return (
    <span className="inline-flex items-center justify-center gap-2">
      <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
      {loadingLabel ?? label}
    </span>
  );
}
