'use client';
import React, { useState, useEffect } from 'react';
import MaintenanceForm from './maintenance-form';
import {
  getAllMaintenance,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance
} from './maintenanceService';
import { MaintenanceFormValues } from './maintenance-schema';
import MaintenanceActionsMenu from './maintenance-actions-menu';
import MaintenanceDetailModal from './maintenance-detail-modal';
import { useVehicle } from '@/features/vehicle/hooks/useVehicle';

export interface MaintenanceRecord {
  id: number;
  vehicle_id: number;
  description: string;
  date: string;
  cost: number;
  notes?: string;
}

const MaintenanceList: React.FC = () => {
  const { vehicles } = useVehicle();
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<MaintenanceRecord | null>(null);
  const [detailRecord, setDetailRecord] = useState<MaintenanceRecord | null>(
    null
  );
  const [search, setSearch] = useState('');
  const [success, setSuccess] = useState('');
  const [filter, setFilter] = useState<'all' | 'withNotes' | 'withoutNotes'>(
    'all'
  );

  const total = records.length;
  const withNotes = records.filter(
    (c) => c.notes && c.notes.trim() !== ''
  ).length;
  const withoutNotes = total - withNotes;

  const filteredRecords = records
    .filter((c) => {
      if (filter === 'withNotes') return c.notes && c.notes.trim() !== '';
      if (filter === 'withoutNotes') return !c.notes || c.notes.trim() === '';
      return true;
    })
    .filter((c) => {
      const q = search.toLowerCase();
      return (
        c.description.toLowerCase().includes(q) ||
        String(c.vehicle_id).includes(q) ||
        (c.notes || '').toLowerCase().includes(q)
      );
    });

  async function fetchRecords() {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllMaintenance();
      setRecords(data);
    } catch (err: any) {
      setError(err.message || 'Bakım kayıtları alınamadı');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRecords();
  }, []);

  function handleOpenAdd() {
    setEditRecord(null);
    setModalOpen(true);
  }
  function handleEdit(record: MaintenanceRecord) {
    setEditRecord(record);
    setModalOpen(true);
  }
  function handleCloseModal() {
    setEditRecord(null);
    setModalOpen(false);
  }
  async function handleSubmit(data: MaintenanceFormValues) {
    setLoading(true);
    try {
      if (editRecord) {
        await updateMaintenance(editRecord.id, data);
        setSuccess('Bakım kaydı güncellendi!');
      } else {
        await createMaintenance(data);
        setSuccess('Bakım kaydı eklendi!');
      }
      fetchRecords();
      setModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'İşlem başarısız');
    } finally {
      setLoading(false);
    }
  }
  async function handleDelete(record: MaintenanceRecord) {
    if (!window.confirm('Bakım kaydı silinsin mi?')) return;
    setLoading(true);
    try {
      await deleteMaintenance(record.id);
      setSuccess('Bakım kaydı silindi!');
      fetchRecords();
    } catch (err: any) {
      setError(err.message || 'Silme başarısız');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='h-full w-full'>
      <div className='flex items-center gap-4 px-8 pt-8 pb-4'>
        <input
          type='text'
          placeholder='Ara: açıklama, araç ID, not...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='bg-muted text-foreground border-border focus:ring-primary w-full max-w-xs rounded border px-4 py-2 focus:ring-2 focus:outline-none'
        />
        <div className='flex gap-2'>
          <button
            onClick={() => setFilter('all')}
            className={`bg-muted rounded px-4 py-1.5 text-sm font-medium ${filter === 'all' ? 'text-primary' : 'text-foreground'} hover:bg-muted/70`}
          >
            Tümü
          </button>
          <button
            onClick={() => setFilter('withNotes')}
            className={`bg-muted rounded px-4 py-1.5 text-sm font-medium ${filter === 'withNotes' ? 'text-green-600 dark:text-green-400' : 'text-foreground'} hover:bg-muted/70`}
          >
            Notlu
          </button>
          <button
            onClick={() => setFilter('withoutNotes')}
            className={`bg-muted rounded px-4 py-1.5 text-sm font-medium ${filter === 'withoutNotes' ? 'text-muted-foreground' : 'text-foreground'} hover:bg-muted/70`}
          >
            Notsuz
          </button>
        </div>
        <button
          onClick={handleOpenAdd}
          className='bg-primary hover:bg-primary/80 ml-auto rounded px-6 py-2 font-semibold text-white'
        >
          Yeni Bakım
        </button>
      </div>
      {loading ? (
        <div className='flex flex-col gap-2 p-8'>
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className='bg-muted h-12 animate-pulse rounded' />
          ))}
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className='text-muted-foreground p-8 text-center'>
          Kayıt bulunamadı.
        </div>
      ) : (
        <div className='overflow-x-auto px-8 pb-8'>
          <table className='bg-background border-border min-w-full overflow-hidden rounded-xl border'>
            <thead>
              <tr className='bg-muted text-muted-foreground text-xs'>
                <th className='p-3 text-left font-semibold'>Araç</th>
                <th className='p-3 text-left font-semibold'>Açıklama</th>
                <th className='p-3 text-left font-semibold'>Tarih</th>
                <th className='p-3 text-left font-semibold'>Tutar</th>
                <th className='p-3 text-left font-semibold'>Not</th>
                <th className='p-3 text-center font-semibold'>Aksiyon</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => {
                const vehicle = vehicles.find(
                  (v) => v.id === record.vehicle_id
                );
                return (
                  <tr
                    key={record.id}
                    className='group hover:bg-muted/50 transition-colors'
                  >
                    <td className='p-3 font-medium'>
                      {vehicle
                        ? `${vehicle.plate} - ${vehicle.brand} ${vehicle.model}`
                        : record.vehicle_id}
                    </td>
                    <td className='p-3'>{record.description}</td>
                    <td className='p-3'>{record.date}</td>
                    <td className='p-3'>{record.cost} ₺</td>
                    <td className='max-w-[220px] truncate p-3 text-xs'>
                      {record.notes || '-'}
                    </td>
                    <td className='p-3 text-center'>
                      <MaintenanceActionsMenu
                        record={record}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onDetail={(r) => setDetailRecord(r)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {modalOpen && (
        <div className='fixed inset-0 z-50 flex'>
          {/* Overlay */}
          <div
            className='fixed inset-0 bg-black/40 transition-opacity'
            onClick={handleCloseModal}
          />
          {/* Drawer */}
          <div className='bg-background animate-slidein-right relative ml-auto flex h-full w-full max-w-xl flex-col shadow-2xl'>
            <button
              onClick={handleCloseModal}
              className='text-muted-foreground hover:text-foreground absolute top-4 right-4 text-xl transition-colors'
            >
              &times;
            </button>
            <div className='flex h-full flex-col gap-2 px-8 pt-8 pb-4'>
              <h2 className='text-foreground mb-4 text-xl font-bold'>
                {editRecord ? 'Bakım Kaydı Düzenle' : 'Yeni Bakım Kaydı'}
              </h2>
              <div className='flex-1 overflow-y-auto'>
                <MaintenanceForm
                  onSubmit={handleSubmit}
                  loading={loading}
                  initialData={editRecord || undefined}
                />
              </div>
              <div className='bg-background border-border sticky right-0 bottom-0 left-0 z-10 border-t px-8 py-4'>
                <button
                  type='submit'
                  form='maintenance-form'
                  disabled={loading}
                  className='bg-primary hover:bg-primary/90 w-full rounded-xl py-3 font-semibold text-white transition-all disabled:opacity-60'
                >
                  {loading ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {detailRecord && (
        <MaintenanceDetailModal
          record={detailRecord}
          onClose={() => setDetailRecord(null)}
        />
      )}
      {error && (
        <div className='fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded bg-red-600 px-6 py-2 text-white shadow-lg'>
          {error}
        </div>
      )}
      {success && (
        <div className='fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded bg-green-600 px-6 py-2 text-white shadow-lg'>
          {success}
        </div>
      )}
    </div>
  );
};

export default MaintenanceList;
