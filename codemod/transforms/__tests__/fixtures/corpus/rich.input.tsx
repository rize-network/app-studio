import clsx from 'clsx';

const base = 'relative flex flex-col items-center justify-between gap-4 p-4 w-full min-h-0 max-w-full overflow-hidden z-10 cursor-pointer select-none pointer-events-auto bg-white dark:bg-gray-900';

export function Example({ active, compact, variant }: {
  active: boolean;
  compact: boolean;
  variant: 'primary' | 'secondary';
}) {
  const variants: Record<string, string> = {
    primary: 'text-blue-600 border-blue-200',
    secondary: 'text-gray-700 border-gray-300',
  };

  return (
    <section
      className={clsx(
        base,
        'rounded-xl border shadow-md transition-colors md:flex-row',
        active && 'opacity-100 hover:bg-gray-50',
        compact ? 'px-2 py-1' : 'px-6 py-4',
        variants[variant],
        'md:hover:ring-2 vendor-contract'
      )}
    >
      <button className="peer bg-blue-500 px-4 py-2 font-semibold text-white">
        Save
      </button>
      <span className="truncate peer-hover:text-blue-700">Description</span>
    </section>
  );
}
