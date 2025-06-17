import React from 'react';
import { VehicleFormValues } from './schemas/vehicleSchema';
import { formatDate, formatCurrency } from '../../utils/formatters';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

interface DialogContentProps {
  className?: string;
  children: React.ReactNode;
}

interface DialogHeaderProps {
  children: React.ReactNode;
}

interface DialogTitleProps {
  className?: string;
  children: React.ReactNode;
}

// UI bileşenlerini basitçe taklit ediyoruz (gerçek UI kitiniz yoksa)
const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="max-w-[800px] w-full rounded-lg bg-white p-6 shadow-lg relative">
        {children}
        <button 
          onClick={() => onOpenChange(false)} 
          className="absolute right-4 top-4 text-gray-400 hover:text-black"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

const DialogContent: React.FC<DialogContentProps> = ({ className, children }) => (
  <div className={`overflow-y-auto ${className || ''}`}>{children}</div>
);

const DialogHeader: React.FC<DialogHeaderProps> = ({ children }) => (
  <div className="mb-6">{children}</div>
);

const DialogTitle: React.FC<DialogTitleProps> = ({ className, children }) => (
  <h2 className={`text-xl font-bold ${className || ''}`}>{children}</h2>
);

interface VehicleDetailModalProps {
  vehicle: VehicleFormValues | null;
  onClose: () => void;
}

interface DetailItemProps {
  label: string;
  value: React.ReactNode;
}

const DetailItem: React.FC<DetailItemProps> = ({ label, value }) => (
  <div className="py-2">
    <span className="font-medium text-gray-700">{label}:</span>{' '}
    <span className="text-gray-900">{value || '-'}</span>
  </div>
);

interface DetailSectionProps {
  title: string;
  children: React.ReactNode;
}

const DetailSection: React.FC<DetailSectionProps> = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="text-lg font-medium mb-2 pb-2 border-b border-gray-200">{title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
      {children}
    </div>
  </div>
);

const getLabel = (options: { label: string; value: any }[], value: any) => {
  const found = options.find((o) => o.value === value);
  return found ? found.label : '-';
};

const VehicleDetailModal: React.FC<VehicleDetailModalProps> = ({ vehicle, onClose }) => {
  if (!vehicle) return null;

  return (
    <Dialog open={!!vehicle} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Araç Detayı: {vehicle.license_plate || 'Yeni Araç'}
          </DialogTitle>
        </DialogHeader>
        
        <DetailSection title="Temel Bilgiler">
          <DetailItem label="Plaka" value={vehicle.license_plate} />
          <DetailItem label="Ruhsat Sahibi Firma" value={vehicle.branch_id} />
          <DetailItem label="Şasi No" value={vehicle.chassis_number} />
          <DetailItem label="Araç Durumu" value={vehicle.vehicle_status_id} />
          <DetailItem label="TSB Kodu" value={vehicle.tsb_code} />
        </DetailSection>
        
        <DetailSection title="Araç Özellikleri">
          <DetailItem label="Marka" value={vehicle.brand_id} />
          <DetailItem label="Model" value={vehicle.model_id} />
          <DetailItem label="Paket" value={vehicle.package_id} />
          <DetailItem label="Renk" value={vehicle.color_id} />
          <DetailItem label="Yakıt Tipi" value={vehicle.fuel_type_id} />
          <DetailItem label="Vites Tipi" value={vehicle.transmission_type_id} />
        </DetailSection>
        
        <DetailSection title="Motor Bilgileri">
          <DetailItem label="Motor No" value={vehicle.engine_no} />
          <DetailItem label="Motor Gücü" value={vehicle.engine_power} />
          <DetailItem label="Motor Hacmi (cc)" value={vehicle.engine_volume} />
        </DetailSection>
        
        <DetailSection title="Satın Alma Bilgileri">
          <DetailItem label="Tedarikçi" value={vehicle.supplier_id} />
          <DetailItem label="Satın Alma Fiyatı" value={formatCurrency(vehicle.purchase_price)} />
          <DetailItem label="Fatura Tarihi" value={formatDate(vehicle.invoice_date)} />
        </DetailSection>
        
        <DetailSection title="Belge Bilgileri">
          <DetailItem label="Son Tescil Tarihi" value={formatDate(vehicle.first_registration_date)} />
          <DetailItem label="Ruhsat Tarihi" value={formatDate(vehicle.registration_date)} />
          <DetailItem label="Muayene Bitiş" value={formatDate(vehicle.inspection_expiry_date)} />
          <DetailItem label="Sonraki Bakım" value={formatDate(vehicle.next_maintenance_date)} />
          <DetailItem label="Egzoz Emisyon Bitiş" value={formatDate(vehicle.exhaust_emission_expiry_date)} />
        </DetailSection>
        
        <DetailSection title="Sigorta Bilgileri">
          <DetailItem label="Sigorta Türü" value={vehicle.insurance_type_id} />
          <DetailItem label="Sigorta Şirketi" value={vehicle.insurance_company_id} />
          <DetailItem label="Sigorta Poliçe No" value={vehicle.insurance_policy_no} />
          <DetailItem label="Sigorta Başlangıç" value={formatDate(vehicle.insurance_start_date)} />
          <DetailItem label="Sigorta Bitiş" value={formatDate(vehicle.insurance_end_date)} />
          <DetailItem label="Sigorta Bedeli" value={formatCurrency(vehicle.insurance_price)} />
        </DetailSection>
        
        <DetailSection title="Kasko Bilgileri">
          <DetailItem label="Kasko Şirketi" value={vehicle.kasko_company_id} />
          <DetailItem label="Kasko Poliçe No" value={vehicle.kasko_policy_no} />
          <DetailItem label="Kasko Başlangıç" value={formatDate(vehicle.kasko_start_date)} />
          <DetailItem label="Kasko Bitiş" value={formatDate(vehicle.kasko_end_date)} />
          <DetailItem label="Kasko Bedeli" value={formatCurrency(vehicle.kasko_price)} />
        </DetailSection>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleDetailModal;
