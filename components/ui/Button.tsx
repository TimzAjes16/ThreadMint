import clsx from 'clsx';
import { forwardRef } from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      iconLeft,
      iconRight,
      className,
      children,
      ...rest
    },
    ref
  ) => {
    const base =
      'inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:ring-offset-2 focus:ring-offset-bg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none';
    const sizes = {
      sm: 'h-9 px-4 text-sm',
      md: 'h-11 px-6 text-base',
      lg: 'h-14 px-8 text-lg',
    };
    const variants = {
      primary:
        'bg-brand-500 text-white hover:bg-brand-600 active:bg-brand-700 shadow-md hover:shadow-lg hover:-translate-y-0.5',
      secondary:
        'bg-panel2 text-text hover:bg-panel border border-line hover:border-line-hover',
      ghost:
        'bg-transparent text-text hover:bg-panel/50 active:bg-panel/70',
    };

    return (
      <button
        ref={ref}
        className={clsx(base, sizes[size], variants[variant], className)}
        {...rest}
      >
        {iconLeft && <span className="mr-2">{iconLeft}</span>}
        {children}
        {iconRight && <span className="ml-2">{iconRight}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

