// Elden çıkarma kayıtları listesi
'use client';
import React, { useState, useEffect } from 'react';
import DisposalForm from './disposal-form';
import {
  getAllDisposals,
  createDisposal,
  updateDisposal,
  deleteDisposal,
  DisposalRecord
} from './disposalService';
import { DisposalFormValues } from './disposal-schema';
import DisposalActionsMenu from './disposal-actions-menu';
import DisposalDetailModal from './disposal-detail-modal';
import { useVehicle } from '@/hooks/useVehicle';

const DisposalList: React.FC = () => {
  const { vehicles } = useVehicle();
  const [records, setRecords] = useState<DisposalRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<DisposalRecord | null>(null);
  const [detailRecord, setDetailRecord] = useState<DisposalRecord | null>(null);
  const [search, setSearch] = useState('');
  const [success, setSuccess] = useState('');
  const [filter, setFilter] = useState<'all' | 'withNotes' | 'withoutNotes'>(
    'all'
  );

  const total = records.length;
  const withNotes = records.filter(
    (r) => r.notes && r.notes.trim() !== ''
  ).length;
  const withoutNotes = total - withNotes;

  async function fetchRecords() {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllDisposals();
      setRecords(data);
    } catch (err: any) {
      setError(err.message || 'Elden çıkarma kayıtları alınamadı');
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
  function handleEdit(record: DisposalRecord) {
    setEditRecord(record);
    setModalOpen(true);
  }
  function handleCloseModal() {
    setEditRecord(null);
    setModalOpen(false);
  }
  async function handleSubmit(data: DisposalFormValues) {
    setLoading(true);
    try {
      if (editRecord) {
        await updateDisposal(editRecord.id, data);
        setSuccess('Kayıt güncellendi!');
      } else {
        await createDisposal(data);
        setSuccess('Kayıt eklendi!');
      }
      fetchRecords();
      setModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'İşlem başarısız');
    } finally {
      setLoading(false);
    }
  }
  async function handleDelete(record: DisposalRecord) {
    if (!window.confirm('Kayıt silinsin mi?')) return;
    setLoading(true);
    try {
      await deleteDisposal(record.id);
      setSuccess('Kayıt silindi!');
      fetchRecords();
    } catch (err: any) {
      setError(err.message || 'Silme başarısız');
    } finally {
      setLoading(false);
    }
  }

  // Filtreleme
  const filteredRecords = records
    .filter((r) => {
      if (filter === 'withNotes') return r.notes && r.notes.trim() !== '';
      if (filter === 'withoutNotes') return !r.notes || r.notes.trim() === '';
      return true;
    })
    .filter((r) => {
      const q = search.toLowerCase();
      const vehicle = vehicles.find((v) => v.id === r.vehicle_id);
      const vehicleMatch =
        vehicle &&
        (vehicle.plate?.toLowerCase().includes(q) ||
          vehicle.brand?.toLowerCase().includes(q) ||
          vehicle.model?.toLowerCase().includes(q));
      const typeMatch = r.disposal_type?.toLowerCase().includes(q);
      const dateMatch = r.disposal_date?.toLowerCase().includes(q);
      const amountMatch =
        r.amount !== undefined && String(r.amount).includes(q);
      const notesMatch = (r.notes || '').toLowerCase().includes(q);
      return (
        vehicleMatch || typeMatch || dateMatch || amountMatch || notesMatch
      );
    });

  return (
    <div className='h-full w-full'>
      <div className='flex items-center gap-4 px-8 pt-8 pb-4'>
        <input
          type='text'
          placeholder='Ara: araç, tür, tarih, tutar, not...'
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
          Yeni Kayıt
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
                <th className='p-3 text-left font-semibold'>Tür</th>
                <th className='p-3 text-left font-semibold'>Tarih</th>
                <th className='p-3 text-left font-semibold'>Tutar</th>
                <th className='p-3 text-left font-semibold'>Not</th>
                <th className='p-3 text-center font-semibold'>Aksiyon</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((r) => {
                const vehicle = vehicles.find((v) => v.id === r.vehicle_id);
                return (
                  <tr
                    key={r.id}
                    className='group hover:bg-muted/50 transition-colors'
                  >
                    <td className='p-3 font-medium'>
                      {vehicle
                        ? `${vehicle.plate} - ${vehicle.brand} ${vehicle.model}`
                        : r.vehicle_id}
                    </td>
                    <td className='p-3'>
                      {r.disposal_type === 'sold'
                        ? 'Satıldı'
                        : r.disposal_type === 'scrapped'
                          ? 'Hurda'
                          : r.disposal_type}
                    </td>
                    <td className='p-3'>{r.disposal_date?.slice(0, 10)}</td>
                    <td className='p-3'>
                      {r.amount !== undefined ? r.amount : '-'}
                    </td>
                    <td className='max-w-[220px] truncate p-3 text-xs'>
                      {r.notes || '-'}
                    </td>
                    <td className='p-3 text-center'>
                      <DisposalActionsMenu
                        record={r}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onDetail={() => setDetailRecord(r)}
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
                {editRecord ? 'Kayıt Düzenle' : 'Yeni Elden Çıkarma'}
              </h2>
              <div className='flex-1 overflow-y-auto'>
                <DisposalForm
                  onSubmit={handleSubmit}
                  loading={loading}
                  initialData={editRecord || undefined}
                />
              </div>
              <div className='bg-background border-border sticky right-0 bottom-0 left-0 z-10 border-t px-8 py-4'>
                <button
                  type='submit'
                  form='disposal-form'
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
        <DisposalDetailModal
          record={detailRecord}
          onClose={() => setDetailRecord(null)}
        />
      )}
      {error && (
        <div className='fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded bg-red-600 px-6 py-2 text-white shadow-lg'>
          {error.includes('duplicate key value violates unique constraint') ? (
            <>
              Bu araca ait zaten bir elden çıkarma kaydı mevcut.
              <br />
              Her araç için sadece bir elden çıkarma kaydı eklenebilir.
            </>
          ) : (
            error
          )}
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

export default DisposalList;
