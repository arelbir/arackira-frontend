import { useState } from 'react';

export interface DrawerStateOptions<T> {
  initialState?: boolean;
  initialContext?: T | null;
}

// Drawer durumunu yöneten genel bir hook
export function useDrawerState<T = any>(options: DrawerStateOptions<T> = {}) {
  const { initialState = false, initialContext = null } = options;
  
  const [isOpen, setIsOpen] = useState<boolean>(initialState);
  const [context, setContext] = useState<T | null>(initialContext);
  
  // Drawer'ı açma fonksiyonu, isteğe bağlı context ile
  const openDrawer = (ctx: T | null = null) => {
    setContext(ctx);
    setIsOpen(true);
  };
  
  // Drawer'ı kapatma fonksiyonu
  const closeDrawer = () => {
    setIsOpen(false);
    // İsterseniz context'i hemen temizlemeyebilirsiniz (animasyon sonrası temizlemek için)
  };
  
  // Drawer kapandıktan sonra context'i temizle
  const resetContext = () => {
    setContext(null);
  };

  return {
    isOpen,
    context,
    openDrawer,
    closeDrawer,
    resetContext,
    setIsOpen
  };
}
