import React from 'react';
import { Vehicle } from '../vehicleService';
import { useBrand, useModel, useColor, useBranch } from '@/features/definitions/hooks';
import { useVehicleStatuses } from '../form/useVehicleStatuses';

interface VehicleDetailModalProps {
  vehicle: Vehicle;
  onClose: () => void;
}

const VehicleDetailModal: React.FC<VehicleDetailModalProps> = ({ vehicle, onClose }) => {
  // Tüm gerekli hook'ları kullan
  const { brands, loading: brandsLoading } = useBrand();
  const { models, loading: modelsLoading } = useModel();
  const { colors, loading: colorsLoading } = useColor();
  const { branches, loading: branchesLoading } = useBranch();
  const { statuses, loading: statusesLoading } = useVehicleStatuses();
  
  // Helper fonksiyonları
  const getBrandName = (id?: number | null) => brands.find((b: { id: number; name: string }) => b.id === id)?.name || '-';
  const getModelName = (id?: number | null) => models.find((m: { id: number; name: string }) => m.id === id)?.name || '-';
  const getColorName = (id?: number | null) => colors.find((c: { id: number; name: string }) => c.id === id)?.name || '-';
  const getBranchName = (id?: number | null) => branches.find((b: { id: number; name: string }) => b.id === id)?.name || '-';
  const getStatusName = (id?: number | null) => statuses.find((s: { id: number; name: string }) => s.id === id)?.name || '-';
  
  // Herhangi bir veri yükleniyorsa
  const loading = brandsLoading || modelsLoading || colorsLoading || branchesLoading || statusesLoading;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 dark:bg-black/70 z-50">
      <div className="bg-background text-foreground p-6 rounded-lg shadow-lg border border-border w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Araç Detayları</h2>
        <ul className="mb-4 space-y-2">
          <li className="flex items-start">
            <span className="font-semibold w-20 inline-block">Plaka:</span> 
            <span>{vehicle.plate_number}</span>
          </li>
          <li className="flex items-start">
            <span className="font-semibold w-20 inline-block">Marka:</span> 
            <span>{loading ? 'Yükleniyor...' : getBrandName(vehicle.brand_id)}</span>
          </li>
          <li className="flex items-start">
            <span className="font-semibold w-20 inline-block">Model:</span> 
            <span>{loading ? 'Yükleniyor...' : getModelName(vehicle.model_id)}</span>
          </li>
          <li className="flex items-start">
            <span className="font-semibold w-20 inline-block">Şube:</span> 
            <span>{loading ? 'Yükleniyor...' : getBranchName(vehicle.branch_id)}</span>
          </li>
          <li className="flex items-start">
            <span className="font-semibold w-20 inline-block">Renk:</span> 
            <span>{loading ? 'Yükleniyor...' : getColorName(vehicle.color_id)}</span>
          </li>
          <li className="flex items-start">
            <span className="font-semibold w-20 inline-block">Durum:</span> 
            <span>{loading ? 'Yükleniyor...' : getStatusName(vehicle.vehicle_status_id)}</span>
          </li>
        </ul>
        <div className="flex justify-end mt-6">
          <button
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded transition-colors"
            onClick={onClose}
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailModal;
