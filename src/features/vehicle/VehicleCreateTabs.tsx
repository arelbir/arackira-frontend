import React, { Suspense, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getVisibleTabs, loadTabComponent, canNavigateToTab, canLeaveTab } from "./registry/VehicleTabsRegistry";
import { ErrorBoundary } from "./common/ErrorBoundary";
import { useVehicleContext } from "./context/VehicleContext";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { UseFormReturn } from "react-hook-form";
import { VehicleFormValues } from "./schemas/vehicleSchema";

// Tab hata mesajları için tip
type TabErrorType = Record<string, string>;

interface VehicleCreateTabsProps {
  form: UseFormReturn<VehicleFormValues>;
}

export default function VehicleCreateTabs({ form }: VehicleCreateTabsProps) {
  const visibleTabs = getVisibleTabs();
  const { activeTabId, setActiveTabId } = useVehicleContext();
  const [tabErrors, setTabErrors] = useState<TabErrorType>({});
  
  // Tab değiştiğinde çağrılır
  const handleTabChange = (tabId: string) => {
    // Tab geçişi için form değerlerini ve zorunlu alanları kontrol et
    const formValues = form.getValues();
    
    // 1. Mevcut tabdan ayrılmaya izin var mı kontrol et
    if (!canLeaveTab(activeTabId, formValues)) {
      // Mevcut tabdan ayrılmadan önce doldurulması gereken alanlar var
      setTabErrors(prev => ({
        ...prev,
        [activeTabId]: "Bu tabdan ayrılmadan önce zorunlu alanları doldurun."
      }));
      return;
    }
    
    // 2. Hedef taba gidilmesine izin var mı kontrol et
    if (canNavigateToTab(tabId, formValues)) {
      setActiveTabId(tabId);
      // Hata mesajını temizle
      if (tabErrors[tabId]) {
        setTabErrors(prev => {
          const newErrors = {...prev};
          delete newErrors[tabId];
          return newErrors;
        });
      }
    } else {
      // Geçiş izni yoksa hata mesajı göster
      setTabErrors(prev => ({
        ...prev,
        [tabId]: "Bu sekmeye geçmek için önce zorunlu alanları doldurun."
      }));
    }
  };

  return (
    <Tabs value={activeTabId} className="w-full" onValueChange={handleTabChange}>
      <div className="flex w-full justify-center mt-6">
        <TabsList className="text-muted-foreground h-9 w-fit items-center justify-center mb-4 bg-muted rounded-lg p-1 flex gap-2 shadow-sm">
          {visibleTabs.map((tab) => (
            <TabsTrigger 
              key={tab.id}
              value={tab.id} 
              className="data-[state=active]:bg-primary data-[state=active]:text-white px-4 py-2 rounded transition"
            >
              {tab.icon && <span className="mr-1">{tab.icon}</span>}
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      
      {tabErrors[activeTabId] && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Zorunlu alanlar eksik</AlertTitle>
          <AlertDescription>{tabErrors[activeTabId]}</AlertDescription>
        </Alert>
      )}
      
      {visibleTabs.map((tab) => {
        const TabComponent = loadTabComponent(tab.id);
        
        return (
          <TabsContent key={tab.id} value={tab.id}>
            <ErrorBoundary>
              <Suspense fallback={
                <div className="flex justify-center items-center p-8 min-h-[300px] border rounded-lg border-dashed">
                  <div className="flex flex-col items-center gap-2">
                    <Spinner size="lg" />
                    <p className="text-sm text-muted-foreground">Sekme yükleniyor...</p>
                  </div>
                </div>
              }>
                {TabComponent && <TabComponent form={form} />}
              </Suspense>
            </ErrorBoundary>
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
