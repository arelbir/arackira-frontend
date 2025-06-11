import { useCallback } from "react";
import { useVehicleContext } from "../context/VehicleContext";
import { getVisibleTabs, canNavigateToTab } from "../registry/VehicleTabsRegistry";
import { toast } from "sonner";
import { TabDefinition } from "../types/tabs";

export const useTabActions = () => {
  const { activeTabId, setActiveTabId } = useVehicleContext();
  const visibleTabs = getVisibleTabs();
  
  // Aktif tab indexini bul
  const currentIndex = visibleTabs.findIndex((tab: TabDefinition) => tab.id === activeTabId);
  
  // İlk tab mı kontrolü
  const isFirstTab = currentIndex === 0;
  
  // Son tab mı kontrolü
  const isLastTab = currentIndex === visibleTabs.length - 1;
  
  // Belirli bir tab'a git
  const goToTab = useCallback((tabId: string, formValues: any) => {
    // Tab'a geçiş yapılabilir mi kontrol et
    if (canNavigateToTab(tabId, formValues)) {
      setActiveTabId(tabId);
      return true;
    } else {
      // Geçiş yapılamıyorsa kullanıcıyı uyar
      toast.error("Zorunlu Alanlar", {
        description: "Bu sekmeye geçmek için önce zorunlu alanları doldurun."
      });
      return false;
    }
  }, [setActiveTabId]);
  
  // Önceki tab'a git
  const goToPreviousTab = useCallback((formValues: any) => {
    if (isFirstTab) return false;
    
    const prevTabId = visibleTabs[currentIndex - 1].id;
    return goToTab(prevTabId, formValues);
  }, [currentIndex, visibleTabs, isFirstTab, goToTab]);
  
  // Sonraki tab'a git
  const goToNextTab = useCallback((formValues: any) => {
    if (isLastTab) return false;
    
    const nextTabId = visibleTabs[currentIndex + 1].id;
    return goToTab(nextTabId, formValues);
  }, [currentIndex, visibleTabs, isLastTab, goToTab]);
  
  return {
    activeTabId,
    goToTab,
    goToPreviousTab,
    goToNextTab,
    isFirstTab,
    isLastTab,
    visibleTabs
  };
};

export default useTabActions;
