'use client';
import React, { useState, useEffect } from 'react';
import ContractForm from './contract-form';
import {
  getAllContracts,
  createContract,
  updateContract,
  deleteContract
} from './contractService';
import { ContractFormValues } from './contract-schema';

export interface Contract {
  id: number;
  contract_number: string;
  supplier: string;
  purchase_date: string;
  total_value: number;
  notes?: string;
}

import ContractActionsMenu from './contract-actions-menu';
import ContractDetailModal from './contract-detail-modal';

const ContractList: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editContract, setEditContract] = useState<Contract | null>(null);
  const [detailContract, setDetailContract] = useState<Contract | null>(null);
  const [search, setSearch] = useState('');
  const [success, setSuccess] = useState('');
  const [filter, setFilter] = useState<'all' | 'withNotes' | 'withoutNotes'>(
    'all'
  );

  const total = contracts.length;
  const withNotes = contracts.filter(
    (c) => c.notes && c.notes.trim() !== ''
  ).length;
  const withoutNotes = total - withNotes;

  const filteredContracts = contracts
    .filter((c) => {
      if (filter === 'withNotes') return c.notes && c.notes.trim() !== '';
      if (filter === 'withoutNotes') return !c.notes || c.notes.trim() === '';
      return true;
    })
    .filter((c) => {
      const q = search.toLowerCase();
      return (
        c.contract_number.toLowerCase().includes(q) ||
        c.supplier.toLowerCase().includes(q) ||
        (c.notes || '').toLowerCase().includes(q)
      );
    });

  async function fetchContracts() {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllContracts();
      setContracts(data);
    } catch (err: any) {
      setError(err.message || 'Sözleşmeler alınamadı');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchContracts();
  }, []);

  function handleOpenAdd() {
    setEditContract(null);
    setModalOpen(true);
  }
  function handleEdit(contract: Contract) {
    setEditContract(contract);
    setModalOpen(true);
  }
  function handleCloseModal() {
    setEditContract(null);
    setModalOpen(false);
  }
  async function handleSubmit(data: ContractFormValues) {
    setLoading(true);
    try {
      if (editContract) {
        await updateContract(editContract.id, data);
        setSuccess('Sözleşme güncellendi!');
      } else {
        await createContract(data);
        setSuccess('Sözleşme eklendi!');
      }
      fetchContracts();
      setModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'İşlem başarısız');
    } finally {
      setLoading(false);
    }
  }
  async function handleDelete(contract: Contract) {
    if (!window.confirm('Sözleşme silinsin mi?')) return;
    setLoading(true);
    try {
      await deleteContract(contract.id);
      setSuccess('Sözleşme silindi!');
      fetchContracts();
    } catch (err: any) {
      setError(err.message || 'Silinemedi');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='bg-background m-0 flex min-h-screen w-full flex-col p-0'>
      <div className='flex flex-wrap items-center gap-6 px-8 pt-8 pb-4'>
        <div className='text-foreground font-semibold'>
          Toplam: <span className='text-primary'>{total}</span>
        </div>
        <div className='text-foreground font-semibold'>
          Notlu:{' '}
          <span className='text-green-600 dark:text-green-400'>
            {withNotes}
          </span>
        </div>
        <div className='text-foreground font-semibold'>
          Notsuz: <span className='text-muted-foreground'>{withoutNotes}</span>
        </div>
        {/* Search & Filter Bar */}
        <div className='flex flex-1 flex-wrap justify-end gap-4'>
          <input
            type='text'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Sözleşme ara...'
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
        </div>
        <button
          onClick={handleOpenAdd}
          className='bg-primary hover:bg-primary/80 ml-auto rounded px-6 py-2 font-semibold text-white'
        >
          Yeni Sözleşme
        </button>
      </div>
      {loading ? (
        <div className='flex flex-col gap-2 p-8'>
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className='bg-muted h-12 animate-pulse rounded' />
          ))}
        </div>
      ) : filteredContracts.length === 0 ? (
        <div className='text-muted-foreground p-8 text-center'>
          Kayıt bulunamadı.
        </div>
      ) : (
        <div className='overflow-x-auto px-8 pb-8'>
          <table className='bg-background border-border min-w-full overflow-hidden rounded-xl border'>
            <thead>
              <tr className='bg-muted text-muted-foreground text-xs'>
                <th className='p-3 text-left font-semibold'>Sözleşme No</th>
                <th className='p-3 text-left font-semibold'>Tedarikçi</th>
                <th className='p-3 text-left font-semibold'>Tarih</th>
                <th className='p-3 text-left font-semibold'>Tutar</th>
                <th className='p-3 text-left font-semibold'>Not</th>
                <th className='p-3 text-center font-semibold'>Aksiyon</th>
              </tr>
            </thead>
            <tbody>
              {filteredContracts.map((contract) => (
                <tr
                  key={contract.id}
                  className='group hover:bg-muted/50 transition-colors'
                >
                  <td className='p-3 font-medium'>
                    {contract.contract_number}
                  </td>
                  <td className='p-3'>{contract.supplier}</td>
                  <td className='p-3'>{contract.purchase_date}</td>
                  <td className='p-3'>{contract.total_value} ₺</td>
                  <td className='max-w-[220px] truncate p-3 text-xs'>
                    {contract.notes || '-'}
                  </td>
                  <td className='p-3 text-center'>
                    <ContractActionsMenu
                      contract={contract}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onDetail={(c) => setDetailContract(c)}
                    />
                  </td>
                </tr>
              ))}
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
                {editContract ? 'Sözleşme Düzenle' : 'Yeni Sözleşme'}
              </h2>
              <div className='flex-1 overflow-y-auto'>
                <ContractForm
                  onSubmit={handleSubmit}
                  loading={loading}
                  initialData={editContract || undefined}
                />
              </div>
              <div className='bg-background border-border sticky right-0 bottom-0 left-0 z-10 border-t px-8 py-4'>
                <button
                  type='submit'
                  form='contract-form'
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
      {detailContract && (
        <ContractDetailModal
          contract={detailContract}
          onClose={() => setDetailContract(null)}
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

export default ContractList;
