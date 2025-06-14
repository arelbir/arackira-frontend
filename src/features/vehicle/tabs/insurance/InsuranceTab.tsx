import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useInsurance } from "../../hooks/useInsurance";
import { useAllInsuranceCompanies } from "@/features/definitions/insurance-companies/use-insurance-companies";
import { useAllInsuranceTypes } from "@/features/definitions/insurance-types/use-insurance-types";
import { useAllCurrencies } from "@/features/definitions/currencies/use-currencies";
import InsuranceList from "./InsuranceList";
import InsuranceForm from "./InsuranceForm";
import { InsuranceType, InsuranceCompany, Currency } from "./utils/mappers";

interface InsuranceTabProps {
  form: any; // Ana araç formu
  vehicleId: number;
}

/**
 * Araç poliçe yönetimi ana bileşeni
 */
const InsuranceTab: React.FC<InsuranceTabProps> = ({ form, vehicleId }) => {
  // Auth ve token
  const { token } = useAuth();
  const safeToken = token ?? '';
  
  // Hook'lar ve veri çekme
  const { insurances, loading, error, fetchInsurances, addInsurance } = useInsurance(safeToken);
  
  // Tanım hook'ları
  const { 
    data: insuranceTypes, 
    isPending: loadingInsuranceTypes, 
    error: errorInsuranceTypes 
  } = useAllInsuranceTypes();
  
  const { 
    data: currencies, 
    isPending: loadingCurrencies, 
    error: errorCurrencies 
  } = useAllCurrencies();
  
  const { 
    data: insuranceCompanies, 
    isPending: loadingCompanies, 
    error: errorCompanies 
  } = useAllInsuranceCompanies();
  
  // UI state
  const [showForm, setShowForm] = useState(false);

  // Veri çekme işlemleri
  // React Query ile veri çekme otomatik olarak gerçekleştirildiği için
  // manual fetch işlemlerine artık gerek yok - otomatik olarak yapılıyor
  // useEffect bloğu kaldırıldı çünkü tüm veri çekme işlemleri React Query tarafından yönetiliyor

  useEffect(() => {
    if (vehicleId) fetchInsurances(vehicleId);
  }, [vehicleId, fetchInsurances]);

  // Form gönderimi işleyicisi
  const handleFormSubmit = async (data: any) => {
    try {
      // Vehicle ID ekle
      await addInsurance({ ...data, vehicle_id: vehicleId });
      
      // Formu kapat ve poliçeleri yeniden getir
      setShowForm(false);
      fetchInsurances(vehicleId);
    } catch (error) {
      console.error("Poliçe kaydedilemedi:", error);
      throw error; // Hata form bileşenine iletilsin
    }
  };

  // Form iptal işleyicisi
  const handleFormCancel = () => {
    setShowForm(false);
  };

  return (
    <Card>
      <CardContent className="max-h-[calc(100vh-12rem)] overflow-y-auto">
        <div className="mb-6 flex items-center justify-between">
          <div className="text-lg font-semibold">Sigorta & Kasko Poliçeleri</div>
          <button
            type="button"
            className="bg-primary text-white px-4 py-1.5 rounded hover:bg-primary/90"
            onClick={() => setShowForm(v => !v)}
          >
            {showForm ? "Kapat" : "Yeni Poliçe"}
          </button>
        </div>
        
        {/* Poliçe listesi */}
        <div className="mb-8">
          <InsuranceList
            insurances={insurances}
            loading={loading}
            insuranceTypes={insuranceTypes}
            insuranceCompanies={insuranceCompanies}
            currencies={currencies}
          />
        </div>
        
        {/* Poliçe formu */}
        {showForm && (
          <InsuranceForm
            vehicleId={vehicleId}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            insuranceTypes={insuranceTypes}
            loadingInsuranceTypes={loadingInsuranceTypes}
            insuranceCompanies={insuranceCompanies}
            loadingCompanies={loadingCompanies}
            currencies={currencies}
            loadingCurrencies={loadingCurrencies}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default InsuranceTab;
