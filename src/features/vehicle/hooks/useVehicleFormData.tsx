import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

interface Option {
  label: string;
  value: any;
}

interface OptionsState {
  options: Option[];
  loading: boolean;
  error: any;
}

interface VehicleFormData {
  branches: OptionsState;
  vehicleStatuses: OptionsState;
  suppliers: OptionsState;
  brands: OptionsState;
  fuelTypes: OptionsState;
  transmissionTypes: OptionsState;
  colors: OptionsState;
  // Diğer gerekli option tanımları eklenebilir
}

export const useVehicleFormData = () => {
  const { token } = useAuth();
  const [formData, setFormData] = useState<VehicleFormData>({
    branches: { options: [], loading: true, error: null },
    vehicleStatuses: { options: [], loading: true, error: null },
    suppliers: { options: [], loading: true, error: null },
    brands: { options: [], loading: true, error: null },
    fuelTypes: { options: [], loading: true, error: null },
    transmissionTypes: { options: [], loading: true, error: null },
    colors: { options: [], loading: true, error: null },
  });

  // Şube seçeneklerini getir
  useEffect(() => {
    const fetchBranches = async () => {
      if (!token) return;
      
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/branches`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!response.ok) throw new Error("Şubeler getirilemedi");
        
        const data = await response.json();
        setFormData(prev => ({
          ...prev,
          branches: {
            options: data.map((item: any) => ({ 
              label: item.name, 
              value: item.id 
            })),
            loading: false,
            error: null
          }
        }));
      } catch (error) {
        setFormData(prev => ({
          ...prev,
          branches: {
            ...prev.branches,
            loading: false,
            error
          }
        }));
      }
    };

    fetchBranches();
  }, [token]);

  // Araç statülerini getir
  useEffect(() => {
    const fetchVehicleStatuses = async () => {
      if (!token) return;
      
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vehicle-statuses`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!response.ok) throw new Error("Araç statüleri getirilemedi");
        
        const data = await response.json();
        setFormData(prev => ({
          ...prev,
          vehicleStatuses: {
            options: data.map((item: any) => ({ 
              label: item.name, 
              value: item.id 
            })),
            loading: false,
            error: null
          }
        }));
      } catch (error) {
        setFormData(prev => ({
          ...prev,
          vehicleStatuses: {
            ...prev.vehicleStatuses,
            loading: false,
            error
          }
        }));
      }
    };

    fetchVehicleStatuses();
  }, [token]);

  // Tedarikçileri getir
  useEffect(() => {
    const fetchSuppliers = async () => {
      if (!token) return;
      
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/suppliers`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!response.ok) throw new Error("Tedarikçiler getirilemedi");
        
        const data = await response.json();
        setFormData(prev => ({
          ...prev,
          suppliers: {
            options: data.map((item: any) => ({ 
              label: item.name, 
              value: item.id 
            })),
            loading: false,
            error: null
          }
        }));
      } catch (error) {
        setFormData(prev => ({
          ...prev,
          suppliers: {
            ...prev.suppliers,
            loading: false,
            error
          }
        }));
      }
    };

    fetchSuppliers();
  }, [token]);

  // Markaları getir
  useEffect(() => {
    const fetchBrands = async () => {
      if (!token) return;
      
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vehicle-brands`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!response.ok) throw new Error("Markalar getirilemedi");
        
        const data = await response.json();
        setFormData(prev => ({
          ...prev,
          brands: {
            options: data.map((item: any) => ({ 
              label: item.name, 
              value: item.id 
            })),
            loading: false,
            error: null
          }
        }));
      } catch (error) {
        setFormData(prev => ({
          ...prev,
          brands: {
            ...prev.brands,
            loading: false,
            error
          }
        }));
      }
    };

    fetchBrands();
  }, [token]);

  // Yakıt tiplerini getir
  useEffect(() => {
    const fetchFuelTypes = async () => {
      if (!token) return;
      
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/fuel-types`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!response.ok) throw new Error("Yakıt tipleri getirilemedi");
        
        const data = await response.json();
        setFormData(prev => ({
          ...prev,
          fuelTypes: {
            options: data.map((item: any) => ({ 
              label: item.name, 
              value: item.id 
            })),
            loading: false,
            error: null
          }
        }));
      } catch (error) {
        setFormData(prev => ({
          ...prev,
          fuelTypes: {
            ...prev.fuelTypes,
            loading: false,
            error
          }
        }));
      }
    };

    fetchFuelTypes();
  }, [token]);

  // Şanzıman tiplerini getir
  useEffect(() => {
    const fetchTransmissionTypes = async () => {
      if (!token) return;
      
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transmission-types`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!response.ok) throw new Error("Şanzıman tipleri getirilemedi");
        
        const data = await response.json();
        setFormData(prev => ({
          ...prev,
          transmissionTypes: {
            options: data.map((item: any) => ({ 
              label: item.name, 
              value: item.id 
            })),
            loading: false,
            error: null
          }
        }));
      } catch (error) {
        setFormData(prev => ({
          ...prev,
          transmissionTypes: {
            ...prev.transmissionTypes,
            loading: false,
            error
          }
        }));
      }
    };

    fetchTransmissionTypes();
  }, [token]);

  // Renkleri getir
  useEffect(() => {
    const fetchColors = async () => {
      if (!token) return;
      
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/colors`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!response.ok) throw new Error("Renkler getirilemedi");
        
        const data = await response.json();
        setFormData(prev => ({
          ...prev,
          colors: {
            options: data.map((item: any) => ({ 
              label: item.name, 
              value: item.id 
            })),
            loading: false,
            error: null
          }
        }));
      } catch (error) {
        setFormData(prev => ({
          ...prev,
          colors: {
            ...prev.colors,
            loading: false,
            error
          }
        }));
      }
    };

    fetchColors();
  }, [token]);

  return formData;
};

export default useVehicleFormData;
