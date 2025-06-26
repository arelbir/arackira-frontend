"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useVehicleForm } from "../context/VehicleCreateProvider";
import { CreateTabContent } from "../TabNavigator";
import { useVehicleCreate } from "../../useVehicleCreate";
import { useRouter } from "next/navigation";

export function ReviewTab() {
  const { form, vehicleId } = useVehicleForm();
  const router = useRouter();

  const totalFields = Object.keys(form.getValues()).length;
  const invalid = Object.keys(form.formState.errors).length;
  const completion = totalFields === 0 ? 0 : Math.round(((totalFields - invalid) / totalFields) * 100);

  if (!vehicleId) {
    return (
      <CreateTabContent value="review" className="pb-24">
        <Card>
          <CardHeader>
            <CardTitle>Özet</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center text-yellow-700 dark:text-yellow-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="size-10 mb-4 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C7 4 2 6 2 11v5a2 2 0 002 2h16a2 2 0 002-2v-5c0-5-5-7-10-9zm0 0v2m0 0c2.5 1 5 2 5 7v5" /></svg>
              <div className="text-lg font-medium mb-1">Özet ve kayıt işlemleri için önce taslak oluşturmalısınız.</div>
              <div className="text-sm">"Taslak Kaydet" butonunu kullanarak önce aracı kaydedin.</div>
            </div>
          </CardContent>
        </Card>
      </CreateTabContent>
    );
  }

  const v = form.watch();
  return (
    <CreateTabContent value="review" className="pb-24">
      <Card>
        <CardHeader>
          <CardTitle>Özet</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-md text-sm overflow-auto max-h-200">
        {JSON.stringify(v, null, 2)}
      </pre>
        </CardContent>
      </Card>
    </CreateTabContent>
  );
}
