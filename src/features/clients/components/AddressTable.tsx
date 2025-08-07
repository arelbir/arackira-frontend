'use client';

import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { ClientAddress } from '../schemas/client.schema';
import { Edit, Trash2 } from 'lucide-react';

interface AddressTableProps {
  addresses: ClientAddress[];
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

export function AddressTable({ addresses, onEdit, onDelete }: AddressTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Adres Başlığı</TableHead>
          <TableHead>Sokak</TableHead>
          <TableHead>Şehir</TableHead>
          <TableHead>Ülke</TableHead>
          <TableHead className="text-right">İşlemler</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {addresses.map((address, index) => (
          <TableRow key={index}>
            <TableCell>{address.address_title}</TableCell>
            <TableCell>{address.street}</TableCell>
            <TableCell>{address.city}</TableCell>
            <TableCell>{address.country}</TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="icon" onClick={() => onEdit(index)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onDelete(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
