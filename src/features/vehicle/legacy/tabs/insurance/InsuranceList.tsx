import React from 'react';
import { Insurance } from "../../hooks/useInsurance";
import InsuranceItem from './InsuranceItem';
import { InsuranceType, InsuranceCompany, Currency } from './utils/mappers';

interface InsuranceListProps {
  insurances: Insurance[];
  loading: boolean;
  insuranceTypes?: InsuranceType[];
  insuranceCompanies?: InsuranceCompany[];
  currencies?: Currency[];
}

/**
 * Poliçe listesini görüntüleyen bileşen
 */
const InsuranceList: React.FC<InsuranceListProps> = ({
  insurances,
  loading,
  insuranceTypes,
  insuranceCompanies,
  currencies
}) => {
  // Yükleme durumu
  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-muted-foreground">Poliçe bilgileri yükleniyor...</p>
      </div>
    );
  }

  // Boş liste durumu
  if (insurances.length === 0) {
    return (
      <div className="border rounded-lg p-8 flex flex-col items-center justify-center bg-muted/10">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-muted-foreground mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="text-lg font-medium mb-2">Henüz Poliçe Kaydı Yok</h3>
        <p className="text-muted-foreground text-center max-w-md">
          Bu araç için henüz kayıtlı sigorta veya kasko poliçesi bulunmuyor. Yeni bir poliçe eklemek için "Yeni Poliçe" butonunu kullanabilirsiniz.
        </p>
      </div>
    );
  }

  // Liste durumu
  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted">
            <th className="p-3 text-left">Poliçe No</th>
            <th className="p-3 text-left">Tür</th>
            <th className="p-3 text-left">Şirket</th>
            <th className="p-3 text-left">Başlangıç</th>
            <th className="p-3 text-left">Bitiş</th>
            <th className="p-3 text-left">Tutar</th>
            <th className="p-3 text-left">Açıklama</th>
          </tr>
        </thead>
        <tbody>
          {insurances.map((insurance, index) => (
            <InsuranceItem 
              key={insurance.id}
              insurance={insurance}
              index={index}
              insuranceTypes={insuranceTypes}
              insuranceCompanies={insuranceCompanies}
              currencies={currencies}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InsuranceList;
