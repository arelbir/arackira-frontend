import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import FormInputField from "../form/FormInputField";
import FormSelectField from "../form/FormSelectField";
import FormDateField from "../form/FormDateField";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useInsurance } from "../hooks/useInsurance";


interface Props {
  form: any;
  vehicleId: number;
}


const VehicleInsuranceTab: React.FC<Props> = ({ form, vehicleId }) => {
  const { token } = useAuth();
  const safeToken = token ?? '';
  const { insurances, loading, error, fetchInsurances, addInsurance } = useInsurance(safeToken);
  const { insuranceTypes, loading: loadingInsuranceTypes, error: errorInsuranceTypes, fetchInsuranceTypes } = require('@/features/definitions/hooks').useInsuranceType(safeToken);
  const { currencies, loading: loadingCurrencies, error: errorCurrencies, fetchCurrencies } = require('@/features/definitions/hooks').useCurrency(safeToken);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (token) {
      fetchInsuranceTypes();
      fetchCurrencies();
    }
  }, [token, fetchInsuranceTypes, fetchCurrencies]);

  useEffect(() => {
    if (vehicleId) fetchInsurances(vehicleId);
  }, [vehicleId, fetchInsurances]);

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

  const onSubmit = async (data: any) => {
    await addInsurance({ ...data, vehicle_id: vehicleId });
    setShowForm(false);
    reset();
    fetchInsurances(vehicleId);
  };

  return (
    <Card>
      <CardContent>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-x-8 gap-y-8">
          {/* Sol: Başlık, breadcrumb ve form */}
          <div>
            <nav className="mb-3 flex items-center gap-2 text-xs font-medium text-muted-foreground" aria-label="breadcrumb">
              <span>Araç</span>
              <span className="mx-1">/</span>
              <span>Sigorta & Kasko</span>
            </nav>
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-semibold">Sigorta & Kasko Poliçeleri</div>
              <button
                className="bg-primary text-white px-4 py-1.5 rounded hover:bg-primary/90"
                onClick={() => setShowForm(v => !v)}
              >
                {showForm ? "Kapat" : "Yeni Poliçe"}
              </button>
            </div>
            {showForm && (
              <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-y-4">
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
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    type="submit"
                    className="bg-primary text-white px-6 py-2 rounded hover:bg-primary/90"
                  >Kaydet</button>
                  <button
                    type="button"
                    className="bg-muted text-foreground px-6 py-2 rounded hover:bg-muted/70"
                    onClick={() => setShowForm(false)}
                  >İptal</button>
                </div>
              </form>
            )}
          </div>
          {/* Sağ: Liste */}
          <div className="col-span-2">
            {loading ? (
              <div>Yükleniyor...</div>
            ) : insurances.length === 0 ? (
              <div className="text-muted-foreground">Kayıtlı poliçe yok.</div>
            ) : (
              <table className="w-full text-sm border">
                <thead>
                  <tr className="bg-muted">
                    <th className="p-2">Poliçe No</th>
                    <th>Tür</th>
                    <th>Şirket</th>
                    <th>Başlangıç</th>
                    <th>Bitiş</th>
                    <th>Tutar</th>
                    <th>Açıklama</th>
                  </tr>
                </thead>
                <tbody>
                  {insurances.map(ins => (
                    <tr key={ins.id} className="border-t">
                      <td className="p-2">{ins.policy_number}</td>
                      <td>{ins.insurance_type_id === 2 ? "Kasko" : "Sigorta"}</td>
                      <td>{ins.insurance_company_id}</td>
                      <td>{ins.start_date}</td>
                      <td>{ins.end_date}</td>
                      <td>{ins.amount}</td>
                      <td>{ins.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleInsuranceTab;
