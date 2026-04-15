import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-classroom-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-classroom-accent text-white shadow-[0_18px_32px_rgba(40,199,111,0.22)] hover:bg-classroom-accent-strong',
        secondary:
          'bg-white text-classroom-ink ring-1 ring-black/8 hover:bg-classroom-muted',
        ghost: 'bg-transparent text-classroom-ink hover:bg-black/5',
      },
      size: {
        default: 'min-h-12 px-6 py-3',
        sm: 'min-h-10 px-4 py-2',
        lg: 'min-h-12 px-8 py-3.5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = 'button', ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        type={type}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
