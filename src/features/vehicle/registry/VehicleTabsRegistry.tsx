import React, { lazy } from "react";

// Tab tanımı için arayüz
export interface TabDefinition {
  id: string;           // Tab ID (URL ve state için)
  label: string;        // Görünen etiket
  icon?: React.ReactNode; // İsteğe bağlı ikon
  component: string;    // Yüklenecek bileşenin adı
  priority: number;     // Görüntüleme önceliği
  requiredFields?: string[]; // Bu tab için doldurulması gereken alanlar
  visible?: boolean;    // Tab görünürlüğü (default: true)
}

// Tüm tablar için merkezi tanım listesi
export const vehicleTabs: TabDefinition[] = [
  { 
    id: "temel-kayit", 
    label: "Temel Kayıt", 
    component: "VehicleBasicInfoTab", 
    priority: 10,
    requiredFields: ["branch_id", "chassis_number", "vehicle_status_id"],
  },
  { 
    id: "arac-detaylari", 
    label: "Araç Detayları", 
    component: "VehicleDetailsTab", 
    priority: 20 
  },
  { 
    id: "belge-bilgileri", 
    label: "Belge Bilgileri", 
    component: "VehicleDocumentsTab", 
    priority: 30 
  },
  { 
    id: "sigorta-kasko", 
    label: "Sigorta & Kasko", 
    component: "VehicleInsuranceTab", 
    priority: 40,
    requiredFields: ["chassis_number"] // Araç kaydının temel alanları
  },
  { 
    id: "lastik", 
    label: "Lastik", 
    component: "VehicleTiresTab", 
    priority: 50,
    visible: false // Henüz geliştirilmemiş
  },
  { 
    id: "bakim-masraf", 
    label: "Bakım ve Masraflar", 
    component: "VehicleMaintenanceTab", 
    priority: 60,
    visible: false // Henüz geliştirilmemiş
  },
  { 
    id: "hgs-ceza", 
    label: "HGS ve Ceza", 
    component: "VehicleHgsFineTab", 
    priority: 70,
    visible: false // Henüz geliştirilmemiş
  },
  { 
    id: "arac-kullanim", 
    label: "Araç Kullanımları", 
    component: "VehicleUsageTab", 
    priority: 80,
    visible: false // Henüz geliştirilmemiş
  },
];

// Görünür tabları filtrele ve sırala
export const getVisibleTabs = () => {
  return vehicleTabs
    .filter(tab => tab.visible !== false)
    .sort((a, b) => a.priority - b.priority);
};

// Tab bileşenini dinamik olarak yükle
export const loadTabComponent = (tabId: string) => {
  const tab = vehicleTabs.find(t => t.id === tabId);
  if (!tab) return null;
  
  // Bu lazy import yapısı, yalnızca gerektiğinde bileşeni yükler
  return lazy(() => import(`../tabs/${tab.component}`));
};

// Tab geçişinin izin verilip verilmeyeceğini kontrol et
export const canNavigateToTab = (tabId: string, formValues: any) => {
  // İlk tab olan "temel-kayit" tabına her zaman gidilebilir olmalı
  if (tabId === "temel-kayit") return true;
  
  const tab = vehicleTabs.find(t => t.id === tabId);
  if (!tab || !tab.requiredFields?.length) return true;
  
  // Gerekli alanlar dolu mu kontrol et
  return tab.requiredFields.every(field => {
    const value = formValues[field];
    return value !== undefined && value !== null && value !== '';
  });
};

// Bir tabdan ayrılmadan önce kontrol et
export const canLeaveTab = (currentTabId: string, formValues: any) => {
  const currentTab = vehicleTabs.find(t => t.id === currentTabId);
  if (!currentTab || !currentTab.requiredFields?.length) return true;

  // İlk sekme için zorunlu alanlar dolu mu kontrol et
  if (currentTabId === "temel-kayit") {
    return currentTab.requiredFields.every(field => {
      const value = formValues[field];
      return value !== undefined && value !== null && value !== '';
    });
  }
  
  // Diğer sekmeler için şimdilik izin ver
  return true;
};

export default {
  vehicleTabs,
  getVisibleTabs,
  loadTabComponent,
  canNavigateToTab,
  canLeaveTab
};
