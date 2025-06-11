"use client";

import { useState } from "react";
import { useAllVehicles, useVehicleMutations, useVehicleById } from "../use-vehicles";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, Edit } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { getVehicleById } from "../vehicle-service";

export function VehicleList() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: vehicles, isLoading, isError } = useAllVehicles();
  const { deleteVehicle, isDeletingVehicle } = useVehicleMutations();
  
  const [deletingId, setDeletingId] = useState<number | null>(null);
  
  // Mouse ile üzerine gelindiğinde araç detaylarını önceden yükle
  const prefetchVehicle = (id: number) => {
    queryClient.prefetchQuery({
      queryKey: ['vehicle', id],
      queryFn: () => getVehicleById(id),
      staleTime: 1000 * 60 * 5, // 5 dakika önbellekleme
    });
  };

  // Aracı sil
  const handleDelete = (id: number) => {
    if (window.confirm("Bu aracı silmek istediğinizden emin misiniz?")) {
      setDeletingId(id);
      deleteVehicle(id, {
        onSettled: () => setDeletingId(null)
      });
    }
  };

  // Düzenleme sayfasına git
  const handleEdit = (id: number) => {
    router.push(`/vehicles/${id}/edit`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Araçlar yükleniyor...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-destructive p-4 border border-destructive/20 rounded-md">
        Araçlar yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.
      </div>
    );
  }

  if (!vehicles || vehicles.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground mb-4">Henüz araç bulunmuyor.</p>
        <Button asChild>
          <Link href="/vehicles/new">Yeni Araç Ekle</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Araç Listesi</h2>
        <Button asChild>
          <Link href="/vehicles/new">Yeni Araç Ekle</Link>
        </Button>
      </div>

      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Plaka</TableHead>
              <TableHead>Marka</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Model Yılı</TableHead>
              <TableHead>Yakıt Tipi</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell className="font-medium">
                  <Link 
                    href={`/vehicles/${vehicle.id}`} 
                    className="hover:underline text-primary"
                    onMouseEnter={() => vehicle.id && prefetchVehicle(vehicle.id)}
                  >
                    {vehicle.plate_number}
                  </Link>
                </TableCell>
                <TableCell>{vehicle.brand_id || "-"}</TableCell>
                <TableCell>{vehicle.model_id || "-"}</TableCell>
                <TableCell>{vehicle.model_year || "-"}</TableCell>
                <TableCell>{vehicle.fuel_type_id || "-"}</TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleEdit(vehicle.id!)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>

                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-destructive hover:text-destructive"
                    onClick={() => vehicle.id && handleDelete(vehicle.id)}
                    disabled={isDeletingVehicle && deletingId === vehicle.id}
                  >
                    {isDeletingVehicle && deletingId === vehicle.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
