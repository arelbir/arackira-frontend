import React, { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import CustomerAvatar from './customer-avatar';
import CustomerDetailModal from './customer-detail-modal';
import CustomerActionsMenu from './customer-actions-menu';
import { MoreVertical, Copy, Eye } from 'lucide-react';

export interface Customer {
  id: number;
  company_name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  active: boolean;
}

interface CustomerListProps {
  customers: Customer[];
  onEdit?: (customer: Customer) => void;
  onDelete?: (customer: Customer) => void;
  onToggleActive?: (customer: Customer, active: boolean) => void;
}

const CustomerList: React.FC<CustomerListProps> = ({
  customers,
  onEdit,
  onDelete,
  onToggleActive
}) => {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [copied, setCopied] = useState(false);

  const total = customers.length;
  const activeCount = customers.filter((c) => c.active).length;
  const inactiveCount = total - activeCount;
  const loading = customers === undefined;

  return (
    <div className='bg-background m-0 flex min-h-screen w-full flex-col p-0'>
      <div className='flex flex-wrap items-center gap-6 px-8 pt-8 pb-4'>
        <div className='text-foreground font-semibold'>
          Toplam: <span className='text-primary'>{total}</span>
        </div>
        <div className='text-foreground font-semibold'>
          Aktif:{' '}
          <span className='text-green-600 dark:text-green-400'>
            {activeCount}
          </span>
        </div>
        <div className='text-foreground font-semibold'>
          Pasif: <span className='text-muted-foreground'>{inactiveCount}</span>
        </div>
        {/* Search & Filter Bar */}
        <div className='flex flex-1 flex-wrap justify-end gap-4'>
          <input
            type='text'
            placeholder='Müşteri ara...'
            className='bg-muted text-foreground border-border focus:ring-primary w-full max-w-xs rounded border px-4 py-2 focus:ring-2 focus:outline-none'
          />
          <div className='flex gap-2'>
            <button className='bg-muted text-primary hover:bg-muted/70 rounded px-4 py-1.5 text-sm font-medium'>
              Tümü
            </button>
            <button className='bg-muted hover:bg-muted/70 rounded px-4 py-1.5 text-sm font-medium text-green-600 dark:text-green-400'>
              Aktif
            </button>
            <button className='bg-muted text-muted-foreground hover:bg-muted/70 rounded px-4 py-1.5 text-sm font-medium'>
              Pasif
            </button>
          </div>
        </div>
      </div>
      {loading ? (
        <div className='flex flex-col gap-2 p-8'>
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className='bg-muted h-12 animate-pulse rounded' />
          ))}
        </div>
      ) : total === 0 ? (
        <div className='text-muted-foreground p-8 text-center'>
          Hiç müşteri yok. <br />
          <span className='text-sm'>
            Yeni müşteri eklemek için yukarıdaki butonu kullanabilirsiniz.
          </span>
        </div>
      ) : (
        <div className='w-full flex-1 overflow-x-auto'>
          <table className='text-foreground w-full max-w-none min-w-[1200px] border-separate border-spacing-0'>
            <thead className='bg-muted sticky top-0 z-10'>
              <tr>
                <th className='text-muted-foreground px-6 py-4 text-left text-xs font-bold tracking-wider'>
                  Durum
                </th>
                <th className='text-muted-foreground px-6 py-4 text-left text-xs font-bold tracking-wider'>
                  Firma Adı
                </th>
                <th className='text-muted-foreground px-6 py-4 text-left text-xs font-bold tracking-wider'>
                  Yetkili Kişi
                </th>
                <th className='text-muted-foreground px-6 py-4 text-left text-xs font-bold tracking-wider'>
                  E-posta
                </th>
                <th className='text-muted-foreground px-6 py-4 text-left text-xs font-bold tracking-wider'>
                  Telefon
                </th>
                <th className='text-muted-foreground px-6 py-4 text-left text-xs font-bold tracking-wider'>
                  Adres
                </th>
                <th className='text-muted-foreground px-6 py-4 text-right text-xs font-bold tracking-wider'>
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer: Customer) => (
                <tr
                  key={customer.id}
                  className={`border-border border-b transition-colors ${hoveredRow === customer.id ? 'bg-muted/60 shadow-lg' : 'hover:bg-muted/60'}`}
                  onMouseEnter={() => setHoveredRow(customer.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{ minHeight: 56 }}
                >
                  <td className='px-6 py-4'>
                    <Switch
                      checked={customer.active}
                      onCheckedChange={(val) =>
                        onToggleActive && onToggleActive(customer, val)
                      }
                      aria-label='Aktif/Pasif'
                    />
                  </td>
                  <td className='text-foreground flex items-center px-6 py-4 font-semibold'>
                    <CustomerAvatar name={customer.company_name} />
                    {customer.company_name}
                  </td>
                  <td className='px-6 py-4'>{customer.contact_person}</td>
                  <td className='px-6 py-4'>{customer.email}</td>
                  <td className='px-6 py-4'>{customer.phone}</td>
                  <td className='px-6 py-4'>{customer.address}</td>
                  <td className='px-6 py-4 text-right'>
                    <CustomerActionsMenu
                      customer={customer}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onDetail={() => setSelectedCustomer(customer)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {selectedCustomer && (
        <CustomerDetailModal
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </div>
  );
};

export default CustomerList;
