import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import FormInputField from "../form/FormInputField";
import FormSelectField from "../form/FormSelectField";
import FormDateField from "../form/FormDateField";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useInsurance, Insurance } from "../hooks/useInsurance";

// Poliçe türü tipi
interface InsuranceType {
  id: number;
  name: string;
  description?: string;
}

// Sigorta şirketi tipi
interface InsuranceCompany {
  id: number;
  name: string;
  description?: string;
}

// Para birimi tipi
interface Currency {
  id: number;
  code?: string;
  name: string;
}


interface Props {
  form: any; // Ana araç formu
  vehicleId: number;
}


const VehicleInsuranceTab: React.FC<Props> = ({ form, vehicleId }) => {
  const { token } = useAuth();
  const safeToken = token ?? '';
  const { insurances, loading, error, fetchInsurances, addInsurance } = useInsurance(safeToken);
  const { insuranceTypes, loading: loadingInsuranceTypes, error: errorInsuranceTypes, fetchInsuranceTypes } = require('@/features/definitions/hooks').useInsuranceType(safeToken);
  const { currencies, loading: loadingCurrencies, error: errorCurrencies, fetchCurrencies } = require('@/features/definitions/hooks').useCurrency(safeToken);
  const { insuranceCompanies, loading: loadingCompanies, error: errorCompanies, fetchInsuranceCompanies } = require('@/features/definitions/hooks').useInsuranceCompany(safeToken);
  const [showForm, setShowForm] = useState(false);

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

  // Poliçe formu için ayrı bir form instance'ı kullan
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      insurance_type_id: 1,
      insurance_company_id: '',
      agency_id: '',
      policy_number: '',
      tramer: '',
      start_date: '',
      end_date: '',
      policy_date: '',
      agency_number: '',
      amount: '',
      tax_rate: '',
      tax_amount: '',
      total_amount: '',
      currency: '1',
      installment_count: '',
      payment_type_id: '',
      payment_account_id: '',
      create_payment_record: false,
      description: '',
    },
  });

  // Poliçe formunu gönderme işlemi - ana araç formunu etkilemez
  const submitInsuranceForm = async (data: any) => {
    try {
      // Poliçe verisini gönder
      await addInsurance({ ...data, vehicle_id: vehicleId });
      
      // Başarılı kayıt sonrası form görünümünü kapat
      setShowForm(false);
      
      // Formu sıfırla
      reset();
      
      // Poliçeleri yeniden getir
      fetchInsurances(vehicleId);
    } catch (error) {
      console.error("Poliçe kaydedilemedi:", error);
    }
  };

  // Poliçe formunu manuel olarak gönder
  const handleInsuranceSubmit = () => {
    // Form verilerini al ve gönder
    handleSubmit(submitInsuranceForm)();
  };

  return (
    <Card>
      <CardContent>
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
        {/* Liste */}
        <div className="mb-8">
          {loading ? (
            <div className="p-8 flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
              <p className="text-muted-foreground">Poliçe bilgileri yükleniyor...</p>
            </div>
          ) : insurances.length === 0 ? (
            <div className="border rounded-lg p-8 flex flex-col items-center justify-center bg-muted/10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-muted-foreground mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium mb-2">Henüz Poliçe Kaydı Yok</h3>
              <p className="text-muted-foreground text-center max-w-md">
                Bu araç için henüz kayıtlı sigorta veya kasko poliçesi bulunmuyor. Yeni bir poliçe eklemek için "Yeni Poliçe" butonunu kullanabilirsiniz.
              </p>
            </div>
          ) : (
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
                  {insurances.map((ins: Insurance, index) => {
                    // API'den dönen veriyi konsolda göster (geliştirme için)
                    console.log('Satır verisi:', ins);
                    
                    // Poliçe türünü bul
                    const insuranceType = insuranceTypes?.find((type: InsuranceType) => 
                      type.id === Number(ins.insurance_type_id)
                    );
                    console.log('Poliçe türü:', insuranceType?.name, 'ID:', ins.insurance_type_id);
                    
                    // Şirket bilgisini bul
                    const company = insuranceCompanies?.find((comp: InsuranceCompany) => 
                      comp.id === Number(ins.insurance_company_id)
                    );
                    console.log('Şirket:', company?.name, 'ID:', ins.insurance_company_id);
                    
                    // Para birimi işleme
                    let currencyText = "TL";
                    
                    try {
                      // Eğer currency bir string ise ve kısa ise (para birimi kodu gibi) direkt kullan
                      if (typeof ins.currency === 'string' && ins.currency.length <= 3) {
                        currencyText = ins.currency;
                      } 
                      // Sayı veya ID ise currencies listesinden bul
                      else {
                        const currencyId = typeof ins.currency === 'string' ? 
                          Number(ins.currency) : ins.currency;
                          
                        const currObj = currencies?.find((curr: Currency) => curr.id === currencyId);
                        if (currObj?.code) {
                          currencyText = currObj.code;
                        }
                      }
                    } catch (e) {
                      console.error('Para birimi işleme hatası:', e);
                      // Hata durumunda TL varsayılanını kullan
                    }
                    
                    // Tarih formatlayıcı
                    const formatDate = (dateStr: string | undefined) => {
                      if (!dateStr) return "-";
                      try {
                        const date = new Date(dateStr);
                        return date.toLocaleDateString('tr-TR');
                      } catch (e) {
                        return dateStr;
                      }
                    };
                    
                    return (
                      <tr 
                        key={ins.id} 
                        className={`border-t ${index % 2 === 1 ? 'bg-muted/10' : ''}`}
                      >
                        <td className="p-3">{ins.policy_number || "-"}</td>
                        <td className="p-3">
                          {/* Tür ismini ya da ID'sini göster */}
                          {insuranceType?.name || 
                           (ins.insurance_type_id === 2 ? "Kasko" : 
                            ins.insurance_type_id === 1 ? "15 Günlük Trafik" : 
                            `Sigorta (${ins.insurance_type_id})`)}
                        </td>
                        <td className="p-3">
                          {/* Şirket ismini ya da ID'sini göster */}
                          {company?.name || 
                           (ins.insurance_company_id === 1 ? "Anadolu Sigorta" : 
                            ins.insurance_company_id === 2 ? "Aksigorta" : 
                            ins.insurance_company_id || "-")}
                        </td>
                        <td className="p-3">{formatDate(ins.start_date)}</td>
                        <td className="p-3">{formatDate(ins.end_date)}</td>
                        <td className="p-3">
                          {ins.amount ? (
                            <span>{Number(ins.amount).toLocaleString('tr-TR')} {currencyText}</span>
                          ) : "-"}
                        </td>
                        <td className="p-3">{ins.description || "-"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {/* Form - Form etiketini kullanmıyoruz, manuel olarak göndereceğiz */}
        {showForm && (
          <div className="border p-4 rounded bg-card">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <Controller
                control={control}
                name="insurance_type_id"
                render={({ field }) => (
                  <FormSelectField
                    {...field}
                    label="Poliçe Türü"
                    options={
                      insuranceTypes?.map((type: any) => ({ value: type.id, label: type.name })) || []
                    }
                    error={errors.insurance_type_id}
                    placeholder={loadingInsuranceTypes ? "Yükleniyor..." : "Seçiniz"}
                    disabled={loadingInsuranceTypes}
                  />
                )}
              />
              <Controller
                control={control}
                name="policy_number"
                render={({ field }) => (
                  <FormInputField
                    {...field}
                    label="Poliçe No"
                    error={errors.policy_number}
                    placeholder="Poliçe numarası"
                  />
                )}
              />
              <Controller
                control={control}
                name="start_date"
                render={({ field }) => (
                  <FormDateField
                    {...field}
                    label="Başlangıç Tarihi"
                    error={errors.start_date}
                    placeholder="Başlangıç"
                  />
                )}
              />
              <Controller
                control={control}
                name="end_date"
                render={({ field }) => (
                  <FormDateField
                    {...field}
                    label="Bitiş Tarihi"
                    error={errors.end_date}
                    placeholder="Bitiş"
                  />
                )}
              />
              <Controller
                control={control}
                name="amount"
                render={({ field }) => (
                  <FormInputField
                    {...field}
                    label="Tutar"
                    type="number"
                    error={errors.amount}
                    placeholder="Tutar"
                  />
                )}
              />
              <Controller
                control={control}
                name="currency"
                render={({ field }) => (
                  <FormSelectField
                    {...field}
                    label="Para Birimi"
                    options={
                      currencies?.map((cur: any) => ({ value: String(cur.id), label: cur.code || cur.name })) || []
                    }
                    error={errors.currency}
                    placeholder={loadingCurrencies ? "Yükleniyor..." : "Seçiniz"}
                    disabled={loadingCurrencies}
                  />
                )}
              />
              <Controller
                control={control}
                name="description"
                render={({ field }) => (
                  <FormInputField
                    {...field}
                    label="Açıklama"
                    error={errors.description}
                    placeholder="Açıklama"
                  />
                )}
              />
              <div className="col-span-full flex justify-end gap-2 mt-4">
                <button
                  type="button" 
                  className="bg-primary text-white px-6 py-2 rounded hover:bg-primary/90"
                  onClick={handleInsuranceSubmit}
                >Kaydet</button>
                <button
                  type="button"
                  className="bg-muted text-foreground px-6 py-2 rounded hover:bg-muted/70"
                  onClick={() => setShowForm(false)}
                >İptal</button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VehicleInsuranceTab;
