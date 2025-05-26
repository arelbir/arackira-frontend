import React from 'react';
import { Insurance } from "../../hooks/useInsurance";
import { formatDate, formatCurrency } from "./utils/formatters";
import { 
  InsuranceType, 
  InsuranceCompany, 
  Currency,
  getInsuranceTypeName,
  getInsuranceCompanyName,
  getCurrencyCode
} from "./utils/mappers";

interface InsuranceItemProps {
  insurance: Insurance;
  index: number;
  insuranceTypes?: InsuranceType[];
  insuranceCompanies?: InsuranceCompany[];
  currencies?: Currency[];
}

/**
 * Tek bir poliçe satırını görüntüleyen bileşen
 */
const InsuranceItem: React.FC<InsuranceItemProps> = ({ 
  insurance, 
  index, 
  insuranceTypes,
  insuranceCompanies,
  currencies
}) => {
  // Poliçe türünü ve şirket bilgisini getir
  const typeName = getInsuranceTypeName(insurance.insurance_type_id, insuranceTypes);
  const companyName = getInsuranceCompanyName(insurance.insurance_company_id, insuranceCompanies);
  
  // Para birimi kodunu getir
  const currencyCode = getCurrencyCode(insurance.currency, currencies);
  
  return (
    <tr className={`border-t ${index % 2 === 1 ? 'bg-muted/10' : ''}`}>
      <td className="p-3">{insurance.policy_number || "-"}</td>
      <td className="p-3">{typeName}</td>
      <td className="p-3">{companyName}</td>
      <td className="p-3">{formatDate(insurance.start_date)}</td>
      <td className="p-3">{formatDate(insurance.end_date)}</td>
      <td className="p-3">
        {insurance.amount ? formatCurrency(insurance.amount, currencyCode) : "-"}
      </td>
      <td className="p-3">{insurance.description || "-"}</td>
    </tr>
  );
};

export default InsuranceItem;
