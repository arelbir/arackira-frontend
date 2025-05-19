// Kiralama kayıtları listesi
'use client';
import React, { useState, useEffect } from 'react';
import RentalForm from './rental-form';
import {
  getAllRentals,
  createRental,
  updateRental,
  deleteRental,
  RentalRecord
} from './rentalService';
import { RentalFormValues } from './rental-schema';
import RentalActionsMenu from './rental-actions-menu';
import RentalDetailModal from './rental-detail-modal';
import { useVehicle } from '@/hooks/useVehicle';
import { useCustomer } from '@/hooks/useCustomer';

const RentalList: React.FC = () => {
  const { vehicles } = useVehicle();
  const { customers } = useCustomer();
  const [records, setRecords] = useState<RentalRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<RentalRecord | null>(null);
  const [detailRecord, setDetailRecord] = useState<RentalRecord | null>(null);
  const [search, setSearch] = useState('');
  const [success, setSuccess] = useState('');

  async function fetchRecords() {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllRentals();
      setRecords(data);
    } catch (err: any) {
      setError(err.message || 'Kiralama kayıtları alınamadı');
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
  function handleEdit(record: RentalRecord) {
    setEditRecord(record);
    setModalOpen(true);
  }
  function handleCloseModal() {
    setEditRecord(null);
    setModalOpen(false);
  }
  async function handleSubmit(data: RentalFormValues) {
    setLoading(true);
    try {
      if (editRecord) {
        await updateRental(editRecord.id, data);
        setSuccess('Kiralama kaydı güncellendi!');
      } else {
        await createRental(data);
        setSuccess('Kiralama kaydı eklendi!');
      }
      fetchRecords();
      setModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'İşlem başarısız');
    } finally {
      setLoading(false);
    }
  }
  async function handleDelete(record: RentalRecord) {
    if (!window.confirm('Kiralama kaydı silinsin mi?')) return;
    setLoading(true);
    try {
      await deleteRental(record.id);
      setSuccess('Kiralama kaydı silindi!');
      fetchRecords();
    } catch (err: any) {
      setError(err.message || 'Silme başarısız');
    } finally {
      setLoading(false);
    }
  }

  const filteredRecords = records.filter((r) => {
    const q = search.toLowerCase();
    const vehicleMatch = String(r.vehicle_id).includes(q);
    const startDateMatch = r.start_date.toLowerCase().includes(q);
    const endDateMatch = r.end_date.toLowerCase().includes(q);
    const contractMatch = r.contract_number.toLowerCase().includes(q);
    const statusMatch = r.status.toLowerCase().includes(q);
    const termsMatch = (r.terms || '').toLowerCase().includes(q);
    const customerMatch = customers.some(
      (c: { id: number; company_name: string }) =>
        c.id === r.client_company_id && c.company_name.toLowerCase().includes(q)
    );
    return (
      vehicleMatch ||
      startDateMatch ||
      endDateMatch ||
      contractMatch ||
      statusMatch ||
      termsMatch ||
      customerMatch
    );
  });

  return (
    <div className='h-full w-full'>
      <div className='flex items-center gap-4 px-8 pt-8 pb-4'>
        <input
          type='text'
          placeholder='Araç, müşteri, tarih, not...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='bg-muted text-foreground border-border focus:ring-primary w-full max-w-xs rounded border px-4 py-2 focus:ring-2 focus:outline-none'
        />
        <button
          onClick={handleOpenAdd}
          className='bg-primary hover:bg-primary/80 ml-auto rounded px-6 py-2 font-semibold text-white'
        >
          Yeni Kiralama
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
                <th className='p-3 text-left font-semibold'>Müşteri</th>
                <th className='p-3 text-left font-semibold'>Sözleşme No</th>
                <th className='p-3 text-left font-semibold'>Başlangıç</th>
                <th className='p-3 text-left font-semibold'>Bitiş</th>
                <th className='p-3 text-left font-semibold'>Durum</th>
                <th className='p-3 text-left font-semibold'>Açıklama</th>
                <th className='p-3 text-center font-semibold'>Aksiyon</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record: RentalRecord) => {
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
                    <td className='p-3'>
                      {(() => {
                        const customer = customers.find(
                          (c: { id: number; company_name: string }) =>
                            c.id === record.client_company_id
                        );
                        return customer
                          ? customer.company_name
                          : record.client_company_id;
                      })()}
                    </td>
                    <td className='p-3'>{record.contract_number}</td>
                    <td className='p-3'>{record.start_date?.slice(0, 10)}</td>
                    <td className='p-3'>{record.end_date?.slice(0, 10)}</td>
                    <td className='p-3'>{record.status}</td>
                    <td className='max-w-[220px] truncate p-3 text-xs'>
                      {record.terms || '-'}
                    </td>
                    <td className='p-3 text-center'>
                      <RentalActionsMenu
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
                {editRecord ? 'Kiralama Kaydı Düzenle' : 'Yeni Kiralama Kaydı'}
              </h2>
              <div className='flex-1 overflow-y-auto'>
                <RentalForm
                  onSubmit={handleSubmit}
                  loading={loading}
                  initialData={editRecord || undefined}
                />
              </div>
              <div className='bg-background border-border sticky right-0 bottom-0 left-0 z-10 border-t px-8 py-4'>
                <button
                  type='submit'
                  form='rental-form'
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
        <RentalDetailModal
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

export default RentalList;
