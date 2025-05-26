import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import VehicleGeneralInfoTab from "./tabs/VehicleGeneralInfoTab";
import VehicleOtherInfoTab from "./tabs/VehicleOtherInfoTab";
import VehicleInsuranceTab from "./tabs/VehicleInsuranceTab";

interface VehicleCreateTabsProps {
  form: any; // react-hook-form instance
}

const tabList = [
  { value: "arac-bilgileri", label: "Araç Bilgileri" },
  { value: "diger-bilgiler", label: "Diğer Bilgiler" },
  { value: "fiyat-tedarikci", label: "Fiyat ve Tedarikçi" },
  { value: "sigorta-muayene", label: "Sigorta ve Muayene" },
  { value: "lastik", label: "Lastik" },
  { value: "bakim-masraf", label: "Bakım ve Masraflar" },
  { value: "hgs-ceza", label: "HGS ve Ceza" },
  { value: "arac-kullanim", label: "Araç Kullanımları" },
];

export default function VehicleCreateTabs({ form }: VehicleCreateTabsProps) {
  return (
    <Tabs defaultValue="genel" className="w-full">
      <div className="flex w-full justify-center mt-6">
        <TabsList className="text-muted-foreground h-9 w-fit items-center justify-center mb-4 bg-muted rounded-lg p-1 flex gap-2 shadow-sm">
        <TabsTrigger value="genel" className="data-[state=active]:bg-primary data-[state=active]:text-white px-4 py-2 rounded transition">Genel Bilgiler</TabsTrigger>
        <TabsTrigger value="diger-bilgiler" className="data-[state=active]:bg-primary data-[state=active]:text-white px-4 py-2 rounded transition">Diğer Bilgiler</TabsTrigger>
        <TabsTrigger value="insurance-kasko" className="data-[state=active]:bg-primary data-[state=active]:text-white px-4 py-2 rounded transition">Sigorta & Kasko</TabsTrigger>
        {/* Diğer TabsTriggerlar burada */}
      </TabsList>
      </div>
      <TabsContent value="genel">
        <VehicleGeneralInfoTab form={form} />
      </TabsContent>
      <TabsContent value="diger-bilgiler">
        <VehicleOtherInfoTab form={form} />
      </TabsContent>
      <TabsContent value="insurance-kasko">
        {/* vehicleId prop'unu uygun şekilde geçirmeniz gerekir! */}
        <VehicleInsuranceTab form={form} vehicleId={form.getValues('id') || 0} />
      </TabsContent>
      <TabsContent value="fiyat-tedarikci">
        <div className="p-6 text-muted-foreground">Fiyat ve tedarikçi ile ilgili alanlar burada olacak.</div>
      </TabsContent>
      <TabsContent value="sigorta-muayene">
        <div className="p-6 text-muted-foreground">Sigorta ve muayene bilgileri burada olacak.</div>
      </TabsContent>
      <TabsContent value="lastik">
        <div className="p-6 text-muted-foreground">Lastik ile ilgili bilgiler burada olacak.</div>
      </TabsContent>
      <TabsContent value="bakim-masraf">
        <div className="p-6 text-muted-foreground">Bakım ve masraf kayıtları burada olacak.</div>
      </TabsContent>
      <TabsContent value="hgs-ceza">
        <div className="p-6 text-muted-foreground">HGS ve ceza bilgileri burada olacak.</div>
      </TabsContent>
      <TabsContent value="arac-kullanim">
        <div className="p-6 text-muted-foreground">Araç kullanım geçmişi burada olacak.</div>
      </TabsContent>
    </Tabs>
  );
}
