import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { useVehicleContext } from "../context/VehicleContext";
import { vehicleSchema, getDefaultValues, getConditionalValidationSchema, VehicleSchema } from "../schemas/vehicleSchema";
import { toast } from "sonner";

export const useVehicleForm = (vehicleId?: number) => {
  const { token } = useAuth();
  const { setIsSubmitting, setIsDirty } = useVehicleContext();
  const [isLoading, setIsLoading] = useState(false);
  // VehicleSchema tipi hem ZodObject hem de ZodEffects tiplerini kapsıyor
  const [validationSchema, setValidationSchema] = useState<VehicleSchema>(vehicleSchema);

  const form = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: getDefaultValues(),
    mode: "onTouched",
  });

  // Eğer düzenleme modundaysa, araç verilerini al
  useEffect(() => {
    const fetchVehicleData = async () => {
      if (!vehicleId || !token) return;

      setIsLoading(true);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/vehicles/${vehicleId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) throw new Error("Araç bilgileri getirilemedi");

        const data = await response.json();
        form.reset(data);
      } catch (error) {
        console.error("Araç verileri getirilemedi:", error);
        toast.error("Hata", {
          description: "Araç bilgileri yüklenirken bir hata oluştu."
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicleData();
  }, [vehicleId, token, form]);

  // Form değerlerine bağlı olarak validasyon şemasını güncelle
  useEffect(() => {
    const subscription = form.watch((values) => {
      setValidationSchema(getConditionalValidationSchema(values));
    });

    return () => subscription.unsubscribe();
  }, [form, form.watch]);

  // Form durumundaki değişiklikleri context'e bildir
  useEffect(() => {
    const { isDirty } = form.formState;
    setIsDirty(isDirty);
  }, [form.formState, setIsDirty]);

  // Form gönderme işlemini yönet
  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Form verilerini doğrula
      const formData = await form.handleSubmit(async (data) => data)();

      // API endpoint'ini belirle
      const endpoint = vehicleId
        ? `${process.env.NEXT_PUBLIC_API_URL}/vehicles/${vehicleId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/vehicles`;

      // HTTP metodunu belirle
      const method = vehicleId ? "PUT" : "POST";

      // API isteğini yap
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "İşlem sırasında bir hata oluştu");
      }

      const result = await response.json();
      
      toast.success(vehicleId ? "Araç güncellendi." : "Araç kaydedildi.");

      return result;
    } catch (error: any) {
      console.error("Form gönderimi sırasında hata:", error);
      
      toast.error("Hata", {
        description: error.message || "Bir hata oluştu, lütfen tekrar deneyin."
      });
      
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    handleSubmit,
    isLoading,
    isSubmitting: form.formState.isSubmitting,
    isDirty: form.formState.isDirty,
    errors: form.formState.errors,
  };
};

export default useVehicleForm;
