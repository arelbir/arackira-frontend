"use client";

import React, { useEffect } from "react";
import { useClients } from "../hooks/useClients";
import { useClientTable } from "../hooks/useClientTable";
import { ClientCompanyWithSubRows } from "../types";
import { Row } from '@tanstack/react-table';

import { DataTable } from "@/components/ui/table/data-table";
import { DataTableToolbar } from "@/components/ui/table/data-table-toolbar";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Edit, Eye } from 'lucide-react';
import Link from 'next/link';

// Alt Bileşen: Sadece veri hazır olduğunda render edilir.
const ClientTableComponent: React.FC<{ clients: ClientCompanyWithSubRows[], mutate: () => void }> = ({ clients, mutate }) => {
  const clientTable = useClientTable(clients, mutate);
  const router = useRouter();

  // useEffect kaldırıldı - useClientTable hook'u tüm column'ları yönetiyor

  return (
    <div className="flex h-full w-full flex-col p-8">
      <DataTableToolbar 
        table={clientTable.table} 
        className="mb-3"
        onAction={() => mutate()}
        editBasePath="/dashboard/clients"
      >
        <div className="flex flex-1 items-center space-x-2">
          <Button size="sm" onClick={() => router.push("/dashboard/clients/new")}>
            Müşteri Ekle
          </Button>
        </div>
      </DataTableToolbar>

      <div className="flex-1 min-h-0 flex flex-col overflow-auto mb-4">
        <DataTable table={clientTable.table} />
      </div>
    </div>
  );
};

// Ana Bileşen: Veri çekme ve yüklenme durumlarını yönetir.
const ClientList: React.FC = () => {
  const { clients, isLoading, isError, mutate } = useClients();

  if (isLoading) {
    return (
      <div className="flex h-full w-full flex-col p-8">
        <DataTableSkeleton columnCount={8} rowCount={10} />
      </div>
    );
  }

  if (isError) {
    return <div className="p-8 text-red-500">Hata: Veri alınamadı.</div>;
  }

  // Veri hazır olduğunda ve boş olmadığında alt bileşeni render et.
  if (clients && clients.length > 0) {
    return <ClientTableComponent clients={clients} mutate={mutate} />;
  }

  // Veri boşsa veya başka bir durum varsa.
  return (
    <div className="flex h-full w-full flex-col p-8">
       <p>Müşteri bulunamadı.</p>
    </div>
  );
};

export default ClientList;
