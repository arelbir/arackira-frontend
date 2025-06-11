import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

interface Option {
  label: string;
  value: any;
}

interface RelatedOptionsState {
  options: Option[];
  loading: boolean;
  error: any;
}

export const useRelatedOptions = () => {
  const { token } = useAuth();
  const [models, setModels] = useState<RelatedOptionsState>({
    options: [],
    loading: false,
    error: null,
  });
  
  const [packages, setPackages] = useState<RelatedOptionsState>({
    options: [],
    loading: false,
    error: null,
  });

  // Seçilen markaya göre modelleri getir
  const fetchModelsByBrand = async (brandId?: number | string) => {
    if (!token || !brandId) {
      setModels({
        options: [],
        loading: false,
        error: null,
      });
      return;
    }

    setModels(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/vehicle-models?brand_id=${brandId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (!response.ok) throw new Error("Modeller getirilemedi");

      const data = await response.json();
      setModels({
        options: data.map((item: any) => ({
          label: item.name,
          value: item.id,
        })),
        loading: false,
        error: null,
      });
    } catch (error) {
      setModels({
        options: [],
        loading: false,
        error,
      });
    }
  };

  // Seçilen modele göre paketleri getir
  const fetchPackagesByModel = async (modelId?: number | string) => {
    if (!token || !modelId) {
      setPackages({
        options: [],
        loading: false,
        error: null,
      });
      return;
    }

    setPackages(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/vehicle-packages?model_id=${modelId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (!response.ok) throw new Error("Paketler getirilemedi");

      const data = await response.json();
      setPackages({
        options: data.map((item: any) => ({
          label: item.name,
          value: item.id,
        })),
        loading: false,
        error: null,
      });
    } catch (error) {
      setPackages({
        options: [],
        loading: false,
        error,
      });
    }
  };

  // Form değerlerindeki değişiklikleri dinleyecek handler
  const handleFormValueChange = (
    field: string,
    value: any,
    onChange: (field: string, value: any) => void
  ) => {
    onChange(field, value);
    
    // Marka değiştiğinde modelleri getir ve paket seçimini sıfırla
    if (field === "brand_id") {
      fetchModelsByBrand(value);
      onChange("model_id", null);
      onChange("package_id", null);
    }
    
    // Model değiştiğinde paketleri getir
    if (field === "model_id") {
      fetchPackagesByModel(value);
      onChange("package_id", null);
    }
  };

  return {
    models,
    packages,
    fetchModelsByBrand,
    fetchPackagesByModel,
    handleFormValueChange,
  };
};

export default useRelatedOptions;
