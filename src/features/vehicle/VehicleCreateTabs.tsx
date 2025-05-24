import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import VehicleGeneralInfoTab from "./tabs/VehicleGeneralInfoTab";

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
          {tabList.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="data-[state=active]:bg-primary data-[state=active]:text-white px-4 py-2 rounded transition"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      <TabsContent value="arac-bilgileri">
        <VehicleGeneralInfoTab form={form} />
      </TabsContent>
      <TabsContent value="diger-bilgiler">
        <div className="p-6 text-muted-foreground">Parametrik ek alanlar burada tanımlanacak.</div>
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
