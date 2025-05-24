'use client';
import React, { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import CustomerList, {
  Customer
} from '@/features/customer/components/customer-list';
import CustomerForm from '@/features/customer/components/customer-form';
import { CustomerFormValues } from '@/features/customer/utils/customer-schema';
import { useCustomer } from '@/features/customer/hooks/useCustomer';
import { ToastProvider, useToast } from '@/components/ToastContext';

import { useDebouncedCallback } from '@/hooks/use-debounced-callback';

const CustomersPage = () => {
  const { showToast } = useToast();
  const {
    customers,
    loading,
    error,
    fetchCustomers,
    addCustomer,
    editCustomer,
    removeCustomer
  } = useCustomer();
  const [editing, setEditing] = useState<Customer | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [customerStates, setCustomerStates] = useState<Record<number, boolean>>(
    {}
  );

  useEffect(() => {
    fetchCustomers().catch((err) => showToast('Müşteriler alınamadı', 'error'));
  }, [fetchCustomers, showToast]);

  // Müşterilerin aktiflik durumunu localde yönet
  useEffect(() => {
    if (customers.length > 0) {
      setCustomerStates(
        customers.reduce((acc, c) => ({ ...acc, [c.id]: !!c.active }), {})
      );
    }
  }, [customers]);

  const handleAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const handleEdit = (customer: Customer) => {
    setEditing(customer);
    setFormOpen(true);
  };

  const handleDelete = async (customer: Customer) => {
    if (window.confirm('Bu müşteriyi silmek istediğinize emin misiniz?')) {
      try {
        await removeCustomer(customer.id);
        showToast('Müşteri silindi', 'success');
      } catch (err: any) {
        showToast(err.message || 'Müşteri silinemedi', 'error');
      }
    }
  };

  const handleSubmit = async (data: CustomerFormValues) => {
    try {
      if (editing) {
        await editCustomer(editing.id, data);
        showToast('Müşteri güncellendi', 'success');
      } else {
        await addCustomer(data);
        showToast('Müşteri eklendi', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'İşlem sırasında hata oluştu', 'error');
    } finally {
      setFormOpen(false);
    }
  };

  const handleToggleActive = (customer: Customer, active: boolean) => {
    setCustomerStates((prev) => ({ ...prev, [customer.id]: active }));
    // Eğer backend'de aktiflik alanı varsa burada API çağrısı yapılmalı
    // await updateCustomerActive(customer.id, active)
  };

  // Filtre ve arama uygulama
  const filteredCustomers = customers
    .filter((c) => {
      if (filter === 'active') return customerStates[c.id] !== false;
      if (filter === 'inactive') return customerStates[c.id] === false;
      return true;
    })
    .filter((c) =>
      [c.company_name, c.contact_person, c.email, c.phone, c.address]
        .join(' ') // tüm alanlarda arama
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .map((c) => ({ ...c, active: customerStates[c.id] !== false }));

  return (
    <ProtectedRoute>
      <div className='m-0 flex min-h-screen w-full flex-col bg-[#18181b] p-0'>
        <div className='bg-background border-border flex items-center justify-between border-b px-8 pt-8 pb-4'>
          <h1 className='text-foreground text-3xl font-bold'>
            Müşteri Yönetimi
          </h1>
          <button
            className='rounded bg-green-600 px-6 py-2 font-semibold text-white shadow hover:bg-green-700'
            onClick={useDebouncedCallback(() => {
              setEditing(null);
              setFormOpen(true);
            }, 300)}
          >
            Yeni Müşteri Ekle
          </button>
        </div>
        <div className='w-full flex-1'>
          <CustomerList
            customers={filteredCustomers}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleActive={handleToggleActive}
          />
        </div>
        {formOpen && (
          <>
            {/* Overlay */}
            <div
              className='fixed inset-0 z-40 bg-black/40 transition-opacity'
              onClick={() => setFormOpen(false)}
            />
            {/* Sağdan kayan Drawer */}
            <div
              className='dark:bg-background animate-slide-in-right fixed top-0 right-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-xl'
              style={{
                transition: 'transform 0.3s',
                transform: formOpen ? 'translateX(0)' : 'translateX(100%)'
              }}
            >
              <div className='border-border flex items-center justify-between border-b px-8 py-6'>
                <h2 className='text-foreground text-2xl font-bold'>
                  {editing ? 'Müşteri Düzenle' : 'Yeni Müşteri Ekle'}
                </h2>
                <button
                  onClick={() => setFormOpen(false)}
                  className='text-muted-foreground hover:text-destructive text-2xl font-bold'
                >
                  &times;
                </button>
              </div>
              <div className='flex flex-1 flex-col items-center justify-center overflow-y-auto px-4 py-8'>
                <div className='w-full'>
                  <CustomerForm
                    onSubmit={async (data) => {
                      await handleSubmit(data);
                      setFormOpen(false);
                    }}
                    initialData={
                      editing
                        ? {
                            company_name: editing.company_name,
                            contact_person: editing.contact_person,
                            email: editing.email,
                            phone: editing.phone,
                            address: editing.address
                          }
                        : undefined
                    }
                  />
                </div>
              </div>
            </div>
            <style>{`
              @keyframes slide-in-right {
                from { transform: translateX(100%); }
                to { transform: translateX(0); }
              }
              .animate-slide-in-right {
                animation: slide-in-right 0.3s cubic-bezier(0.4,0,0.2,1);
              }
            `}</style>
          </>
        )}
        <div className='mt-4 flex flex-col items-center gap-2 px-8 md:flex-row'>
          <input
            type='text'
            placeholder='Müşteri ara...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='w-full rounded border px-3 py-2 focus:ring-2 focus:ring-blue-200 focus:outline-none md:w-64'
          />
          <div className='flex flex-wrap gap-2'>
            <button
              className={`rounded px-3 py-1 text-sm ${filter === 'all' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setFilter('all')}
            >
              Tümü
            </button>
            <button
              className={`rounded px-3 py-1 text-sm ${filter === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setFilter('active')}
            >
              Aktif
            </button>
            <button
              className={`rounded px-3 py-1 text-sm ${filter === 'inactive' ? 'bg-gray-300 text-gray-800' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setFilter('inactive')}
            >
              Pasif
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

const CustomersPageWithToast = () => (
  <ToastProvider>
    <CustomersPage />
  </ToastProvider>
);

export default CustomersPageWithToast;
