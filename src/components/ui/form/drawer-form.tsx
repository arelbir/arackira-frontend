'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { DrawerHeader, DrawerContent, DrawerClose } from '@/components/ui/drawer';
import { DrawerFormHeader } from './drawer-form-header';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DrawerFormProps {
  title: string;
  children: ReactNode;
  onSave: () => void;
  onCancel: () => void;
  saveButtonLabel?: string;
  cancelButtonLabel?: string;
  isLoading?: boolean;
  saveDisabled?: boolean;
  width?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | 'full';
}

/**
 * Tüm açılır formlar için ortak kullanabileceğimiz drawer form yapısı.
 * Form header, scroll area ve içerik bölümlerini içerir.
 */
export function DrawerForm({
  title,
  children,
  onSave,
  onCancel,
  saveButtonLabel,
  cancelButtonLabel,
  isLoading,
  saveDisabled,
  width = '6xl'
}: DrawerFormProps) {
  // Erişilebilirlik için odak (focus) yönetimi
  const initialFocusRef = useRef<HTMLButtonElement>(null);
  const firstFocusableRef = useRef<HTMLDivElement>(null);
  
  // Drawer açıldığında ve kapandığında focus yönetimi
  useEffect(() => {
    // Drawer içeriği yüklendiğinde odağı temizle ve güvenli bir elemana aktar
    const handleFocus = () => {
      // İçerik yüklendiğinde içeriden dışarıya odak sızmasını engelle
      if (firstFocusableRef.current) {
        firstFocusableRef.current.focus();
      }
    };
    
    // İlk yüklemede focus'u ayarla
    handleFocus();
    
    // Event listener cleanup
    return () => {
      // Drawer kapandığında temizlik işlemleri
      document.body.focus();
    };
  }, []);
  
  return (
    <DrawerContent className={`w-full max-w-${width} h-full`}>
      {/* Erişilebilirlik için gizli odak tuzağı */}
      <div tabIndex={-1} ref={firstFocusableRef}></div>
      
      <DrawerHeader className="border-b pb-4">
        <DrawerFormHeader
          title={title}
          onSave={onSave}
          onCancel={onCancel}
          saveButtonLabel={saveButtonLabel}
          cancelButtonLabel={cancelButtonLabel}
          isLoading={isLoading}
          saveDisabled={saveDisabled}
        />
      </DrawerHeader>
      
      <ScrollArea className="h-[calc(100vh-120px)]">
        {children}
      </ScrollArea>
      
      {/* Görünmez kapatma butonu - erişilebilirlik için */}
      <DrawerClose className="sr-only" aria-hidden="false">
        Kapat
      </DrawerClose>
    </DrawerContent>
  );
}
