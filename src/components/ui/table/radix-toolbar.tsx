import * as React from 'react';
import * as Toolbar from '@radix-ui/react-toolbar';
import { cn } from '@/lib/utils';

type RadixToolbarProps = React.ComponentPropsWithoutRef<typeof Toolbar.Root> & {
  children: React.ReactNode;
};

export function RadixToolbar({ children, className, ...props }: RadixToolbarProps) {
  return (
    <Toolbar.Root
      className={cn(
        'flex w-full items-center gap-2 rounded-xl border bg-card shadow-sm dark:bg-card/80 px-4 py-2 transition-colors',
        className
      )}
      {...props}
    >
      {children}
    </Toolbar.Root>
  );
}

export const RadixToolbarButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Toolbar.Button>
>(({ className, ...props }, ref) => (
  <Toolbar.Button
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-muted hover:bg-accent border',
      className
    )}
    {...props}
  />
));
RadixToolbarButton.displayName = 'RadixToolbarButton';

export const RadixToolbarSeparator = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Toolbar.Separator>
>(({ className, ...props }, ref) => (
  <Toolbar.Separator
    ref={ref}
    className={cn('mx-2 h-6 w-px bg-border', className)}
    {...props}
  />
));
RadixToolbarSeparator.displayName = 'RadixToolbarSeparator';
