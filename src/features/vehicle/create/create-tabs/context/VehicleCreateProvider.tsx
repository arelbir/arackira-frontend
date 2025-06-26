"use client";

import React, { createContext, useContext, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { vehicleCreateSchema, VehicleCreateValues } from "../schema";

interface VehicleCreateProviderProps {
  children: React.ReactNode;
  defaultValues?: Partial<VehicleCreateValues>;
}

const DRAFT_KEY = "vehicleCreateDraft";

interface VehicleFormContextType {
  form: ReturnType<typeof useForm<VehicleCreateValues>>;
  vehicleId: number | null;
  setVehicleId: (id: number) => void;
}

const VehicleFormContext = createContext<VehicleFormContextType | null>(null);

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const VehicleCreateProvider: React.FC<VehicleCreateProviderProps> = ({ children, defaultValues }) => {
  const [mounted, setMounted] = React.useState(false);
  const [showDraftDialog, setShowDraftDialog] = React.useState(false);
  const [draft, setDraft] = React.useState<Partial<VehicleCreateValues> | null>(null);
  const [useDraft, setUseDraft] = React.useState<boolean | null>(null);

  // On mount, check for draft
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(DRAFT_KEY);
        if (raw) {
          setDraft(JSON.parse(raw));
          setShowDraftDialog(true);
        }
      } catch {
        setDraft(null);
      }
    }
    setMounted(true);
  }, []);

  // If user rejects draft, clear it
  React.useEffect(() => {
    if (useDraft === false) {
      localStorage.removeItem(DRAFT_KEY);
      setDraft(null);
      setShowDraftDialog(false);
    }
    if (useDraft === true) {
      setShowDraftDialog(false);
    }
  }, [useDraft]);

  // Form default values: only after user decision or no draft
  const [vehicleId, setVehicleId] = React.useState<number | null>(null);
  const methods = useForm<VehicleCreateValues>({
    resolver: zodResolver(vehicleCreateSchema),
    mode: "onBlur",
    defaultValues: React.useMemo(() => {
      if (!mounted) return undefined;
      if (draft && useDraft === null) return undefined; // wait for user choice
      if (draft && useDraft) {
        return { brand_id: '', model_id: '', ...draft, ...(defaultValues || {}) } as Partial<VehicleCreateValues>;
      }
      return { brand_id: '', model_id: '', ...(defaultValues || {}) } as Partial<VehicleCreateValues>;
    }, [draft, useDraft, mounted, defaultValues]),
  });

  // Taslaklar artık backend'de tutuluyor, localStorage persistence kaldırıldı.

  if (!mounted || (draft && useDraft === null)) {
    // SSR/CSR uyumsuzluğunu engelle: ilk yüklemede veya draft varsa ve karar bekleniyorsa formu render etme
    return (
      <Dialog open={showDraftDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Taslak veriler bulundu</DialogTitle>
            <DialogDescription>Kaydedilmiş bir taslak var. Yüklemek ister misiniz?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUseDraft(false)}>Hayır, temizle</Button>
            <Button onClick={() => setUseDraft(true)} autoFocus>Evet, yükle</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <VehicleFormContext.Provider value={{ form: methods, vehicleId, setVehicleId }}>
      <FormProvider {...methods}>{children}</FormProvider>
    </VehicleFormContext.Provider>
  );
};

export const useVehicleForm = () => {
  const ctx = useContext(VehicleFormContext);
  if (!ctx) throw new Error("useVehicleForm must be used within VehicleCreateProvider");
  return ctx;
};
