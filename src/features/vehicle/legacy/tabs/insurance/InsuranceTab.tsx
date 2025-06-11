import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useInsurance } from "../../hooks/useInsurance";
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
    insuranceTypes, 
    loading: loadingInsuranceTypes, 
    error: errorInsuranceTypes, 
    fetchInsuranceTypes 
  } = require('@/features/definitions/hooks').useInsuranceType(safeToken);
  
  const { 
    currencies, 
    loading: loadingCurrencies, 
    error: errorCurrencies, 
    fetchCurrencies 
  } = require('@/features/definitions/hooks').useCurrency(safeToken);
  
  const { 
    insuranceCompanies, 
    loading: loadingCompanies, 
    error: errorCompanies, 
    fetchInsuranceCompanies 
  } = require('@/features/definitions/hooks').useInsuranceCompany(safeToken);
  
  // UI state
  const [showForm, setShowForm] = useState(false);

  // Veri çekme işlemleri
  useEffect(() => {
    if (token) {
      fetchInsuranceTypes();
      fetchCurrencies();
      fetchInsuranceCompanies();
    }
  }, [token, fetchInsuranceTypes, fetchCurrencies, fetchInsuranceCompanies]);

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
