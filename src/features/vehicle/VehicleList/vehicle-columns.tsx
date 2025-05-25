import { ColumnDef } from '@tanstack/react-table';
import { Vehicle } from '../vehicleService';
import VehicleActionsMenu from './VehicleActionsMenu';

interface VehicleColumnsProps {
  onDetail: (v: Vehicle) => void;
  onEdit: (v: Vehicle) => void;
  onDelete: (v: Vehicle) => void;
  getBrandName: (id?: number | null) => string;
  getModelName: (id?: number | null) => string;
  getBranchName: (id?: number | null) => string;
  getColorName: (id?: number | null) => string;
  getStatusName: (id?: number | null) => string;
  loadingId: number | null;
}

export function getVehicleColumns({
  onDetail,
  onEdit,
  onDelete,
  getBrandName,
  getModelName,
  getBranchName,
  getColorName,
  getStatusName,
  loadingId,
}: VehicleColumnsProps): ColumnDef<Vehicle, any>[] {
  return [
    {
      accessorKey: 'plate_number',
      header: 'Plaka',
      cell: info => info.getValue(),
    },
    {
      accessorKey: 'brand_id',
      header: 'Marka',
      cell: info => getBrandName(info.row.original.brand_id),
    },
    {
      accessorKey: 'model_id',
      header: 'Model',
      cell: info => getModelName(info.row.original.model_id),
    },
    {
      accessorKey: 'branch_id',
      header: 'Şube',
      cell: info => getBranchName(info.row.original.branch_id),
    },
    {
      accessorKey: 'color_id',
      header: 'Renk',
      cell: info => getColorName(info.row.original.color_id),
    },
    {
      accessorKey: 'vehicle_status_id',
      header: 'Durum',
      cell: info => getStatusName(info.row.original.vehicle_status_id),
    },
    {
      id: 'actions',
      header: '',
      cell: info => (
        <VehicleActionsMenu
          vehicle={info.row.original}
          onDetail={onDetail}
          onEdit={onEdit}
          onDelete={onDelete}
          deleting={loadingId === info.row.original.id}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ];
}
