import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './alert';

export interface NotificationProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  onDismiss?: () => void;
  autoHideDuration?: number;
  showIcon?: boolean;
}

const notificationVariants = cva(
  'fixed z-50 px-6 py-3 rounded shadow-lg text-white transition-all duration-300',
  {
    variants: {
      type: {
        success: 'bg-green-600',
        error: 'bg-red-600',
        warning: 'bg-yellow-600',
        info: 'bg-blue-600',
      },
      position: {
        'top-right': 'top-6 right-6',
        'top-left': 'top-6 left-6',
        'bottom-right': 'bottom-6 right-6',
        'bottom-left': 'bottom-6 left-6',
        center: 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
      },
    },
    defaultVariants: {
      type: 'info',
      position: 'top-right',
    },
  }
);

/**
 * Notification bileşeni - bildirimler ve uyarılar için kullanılır
 */
export const Notification = React.forwardRef<
  HTMLDivElement,
  NotificationProps & VariantProps<typeof notificationVariants>
>(({
  type = 'info',
  title,
  message,
  onDismiss,
  autoHideDuration = 5000,
  showIcon = true,
  position = 'top-right',
  className,
  ...props
}, ref) => {
  React.useEffect(() => {
    if (autoHideDuration && onDismiss) {
      const timer = setTimeout(() => {
        onDismiss();
      }, autoHideDuration);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [autoHideDuration, onDismiss]);

  const getIcon = () => {
    if (!showIcon) return null;

    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5" />;
      case 'error':
        return <XCircle className="h-5 w-5" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5" />;
      case 'info':
        return <Info className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const getVariant = () => {
    switch (type) {
      case 'error':
        return 'destructive';
      default:
        return 'default';
    }
  };

  return (
    <div
      ref={ref}
      className={cn(notificationVariants({ type, position }), className)}
      {...props}
    >
      <Alert variant={getVariant()}>
        {getIcon()}
        {title && <AlertTitle>{title}</AlertTitle>}
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    </div>
  );
});

Notification.displayName = 'Notification';

/**
 * Bildirim için hook - global bildirim yönetimi için
 */
export function useNotification() {
  const [notification, setNotification] = React.useState<Omit<NotificationProps, 'onDismiss'> | null>(null);
  
  const showNotification = (props: Omit<NotificationProps, 'onDismiss'>) => {
    setNotification(props);
  };
  
  const hideNotification = () => {
    setNotification(null);
  };
  
  const success = (message: string, title?: string, options?: Partial<Omit<NotificationProps, 'type' | 'message' | 'title'>>) => {
    showNotification({ type: 'success', message, title, ...options });
  };
  
  const error = (message: string, title?: string, options?: Partial<Omit<NotificationProps, 'type' | 'message' | 'title'>>) => {
    showNotification({ type: 'error', message, title, ...options });
  };
  
  const warning = (message: string, title?: string, options?: Partial<Omit<NotificationProps, 'type' | 'message' | 'title'>>) => {
    showNotification({ type: 'warning', message, title, ...options });
  };
  
  const info = (message: string, title?: string, options?: Partial<Omit<NotificationProps, 'type' | 'message' | 'title'>>) => {
    showNotification({ type: 'info', message, title, ...options });
  };
  
  const notificationElement = notification ? (
    <Notification
      {...notification}
      onDismiss={hideNotification}
    />
  ) : null;
  
  return {
    success,
    error,
    warning,
    info,
    showNotification,
    hideNotification,
    notification,
    notificationElement,
  };
}
