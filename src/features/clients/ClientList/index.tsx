"use client";

import React, { useEffect } from "react";
import { useClients } from "../hooks/useClients";
import { useClientTable } from "../hooks/useClientTable";
import { useBulkActions } from "@/hooks/useBulkActions";
import { DataTable } from "@/components/ui/table/data-table";
import { DataTableToolbar } from "@/components/ui/table/data-table-toolbar";
import { DataTableBulkActionsSlideIn } from "@/components/ui/table/data-table-bulk-actions-slide-in";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { DataTablePagination } from "@/components/ui/table/data-table-pagination";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";


const ClientList: React.FC = () => {
  const { clients, isLoading, isError, mutate } = useClients();
  const { table, selectedRows } = useClientTable(clients, mutate);
  const router = useRouter();
  
  // Bu useEffect, bileşen mount edildikten sonra TanStack Table'ın
  // pagination state'ini initialize etmesini sağlar, render sırasında değil
  useEffect(() => {
    // Boş useEffect, bileşen mount edildikten sonra çalışacak
    // ve dolayısıyla TanStack Table'ın initial state işlemleri güvenli bir şekilde yapılabilecek
  }, []);
  
  // Toplu işlemler için useBulkActions hook'unu kullan
  const { 
    isProcessing, 
    handleBulkDelete,
    handleBulkRestore 
  } = useBulkActions({
    resourceUrl: '/api/clients',
    onAction: () => mutate()
  });

  if (isError)
    return (
      <div className="p-8 text-red-500">Hata: Veri alınamadı.</div>
    );

  return (
    <div className="flex h-full w-full flex-col p-8">
      <DataTableToolbar 
        table={table} 
        className="mb-3"
        resourceUrl="/api/clients"
        onAction={() => mutate()}
        editBasePath="/dashboard/clients"
      >
        <div className="flex flex-1 items-center space-x-2">
          {/* Yeni Müşteri Butonu */}
          <Button
            size="sm"
            onClick={() => router.push("/dashboard/clients/new")}
          >
            Müşteri Ekle
          </Button>
        </div>
      </DataTableToolbar>

      <div className="flex-1 min-h-0 flex flex-col overflow-auto mb-4">
        {isLoading ? (
          <DataTableSkeleton
            columnCount={table.getAllColumns().length}
            rowCount={10}
          />
        ) : (
          <DataTable table={table} />
        )}
      </div>
      

    </div>
  );
};

export default ClientList;
