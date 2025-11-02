import clsx from 'clsx';

export function Card({
  children,
  className,
  hover,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={clsx(
        'rounded-lg bg-panel border border-line shadow-sm',
        hover && 'card-hover cursor-pointer border-line-hover',
        className
      )}
    >
      {children}
    </div>
  );
}

