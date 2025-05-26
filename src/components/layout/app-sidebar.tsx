'use client';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail
} from '@/components/ui/sidebar';
import { UserAvatarProfile } from '@/components/user-avatar-profile';
import { navItems } from '@/constants/data';
import { useMediaQuery } from '@/hooks/use-media-query';

import {
  IconBell,
  IconChevronRight,
  IconChevronsDown,
  IconCreditCard,
  IconLogout,
  IconPhotoUp,
  IconUserCircle,
  IconCar
} from '@tabler/icons-react';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';
import { Icons } from '../icons';
import { OrgSwitcher } from '../org-switcher';
export const company = {
  name: 'Akro Holding',
  logo: IconPhotoUp,
  plan: 'Kurumsal'
};

const tenants = [{ id: '1', name: 'Maki Filo' }];

import { useAuth } from '@/hooks/useAuth';

export default function AppSidebar() {
  const { logoutUser } = useAuth();
  const pathname = usePathname();
  const { isOpen } = useMediaQuery();
  // TODO: Replace with your custom user state logic if needed.
  const router = useRouter();
  const handleSwitchTenant = (_tenantId: string) => {
    // Tenant switching functionality would be implemented here
  };

  const activeTenant = tenants[0];

  React.useEffect(() => {
    // Side effects based on sidebar state changes
  }, [isOpen]);

  return (
    <Sidebar collapsible='icon'>
      <SidebarHeader>
        <OrgSwitcher
          tenants={tenants}
          defaultTenant={activeTenant}
          onTenantSwitch={handleSwitchTenant}
        />
      </SidebarHeader>
      <SidebarContent className='overflow-x-hidden'>
        <SidebarGroup>
          <SidebarGroupLabel>Genel Bakış</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip='Genel Bakış'
                isActive={pathname === '/dashboard/overview'}
              >
                <Link href='/dashboard/overview'>
                  <Icons.dashboard className='mr-2' />
                  <span>Genel Bakış</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Araçlar</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip='Araçlar'
                isActive={pathname === '/dashboard/vehicles'}
              >
                <Link href='/dashboard/vehicles'>
                  <IconCar className='mr-2' />
                  <span>Araçlar</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip='Elden Çıkarma'
                isActive={pathname === '/dashboard/disposal'}
              >
                <Link href='/dashboard/disposal'>
                  <Icons.trash className='mr-2' />
                  <span>Elden Çıkarma</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Sözleşmeler</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip='Sözleşmeler'
                isActive={pathname === '/dashboard/contracts'}
              >
                <Link href='/dashboard/contracts'>
                  <Icons.post className='mr-2' />
                  <span>Sözleşmeler</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Müşteriler</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip='Müşteriler'
                isActive={pathname === '/dashboard/customers'}
              >
                <Link href='/dashboard/customers'>
                  <Icons.user className='mr-2' />
                  <span>Müşteriler</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Bakım</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip='Bakım'
                isActive={pathname === '/dashboard/maintenance'}
              >
                <Link href='/dashboard/maintenance'>
                  <Icons.settings className='mr-2' />
                  <span>Bakım</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Kiralama</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip='Kiralama'
                isActive={pathname === '/dashboard/rental'}
              >
                <Link href='/dashboard/rental'>
                  <Icons.page className='mr-2' />
                  <span>Kiralama</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Tanımlar</SidebarGroupLabel>
          <SidebarMenu>
             <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip='Renk Tanımları'
                isActive={pathname === '/dashboard/definitions/colors'}
              >
                <Link href='/dashboard/definitions/colors'>
                  <Icons.settings className='mr-2' />
                  <span>Renkler</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip='Şubeler'
                isActive={pathname === '/dashboard/definitions/branches'}
              >
                <Link href='/dashboard/definitions/branches'>
                  <Icons.settings className='mr-2' />
                  <span>Şubeler</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip='Markalar'
                isActive={pathname === '/dashboard/definitions/brands'}
              >
                <Link href='/dashboard/definitions/brands'>
                  <Icons.settings className='mr-2' />
                  <span>Markalar</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip='Modeller'
                isActive={pathname === '/dashboard/definitions/models'}
              >
                <Link href='/dashboard/definitions/models'>
                  <Icons.settings className='mr-2' />
                  <span>Modeller</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip='Müşteri Tipleri'
                isActive={pathname === '/dashboard/definitions/client-types'}
              >
                <Link href='/dashboard/definitions/client-types'>
                  <Icons.settings className='mr-2' />
                  <span>Müşteri Tipleri</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip='Yakıt Tipleri'
                isActive={pathname === '/dashboard/definitions/fuel-types'}
              >
                <Link href='/dashboard/definitions/fuel-types'>
                  <Icons.settings className='mr-2' />
                  <span>Yakıt Tipleri</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip='Vites Tipleri'
                isActive={pathname === '/dashboard/definitions/transmissions'}
              >
                <Link href='/dashboard/definitions/transmissions'>
                  <Icons.settings className='mr-2' />
                  <span>Vites Tipleri</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip='Araç Tipleri'
                isActive={pathname === '/dashboard/definitions/vehicle-types'}
              >
                <Link href='/dashboard/definitions/vehicle-types'>
                  <Icons.settings className='mr-2' />
                  <span>Araç Tipleri</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip='Araç Statüleri'
                isActive={pathname === '/dashboard/definitions/vehicle-statuses'}
              >
                <Link href='/dashboard/definitions/vehicle-statuses'>
                  <Icons.settings className='mr-2' />
                  <span>Araç Statüleri</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip='Sigorta Şirketleri'
                isActive={pathname === '/dashboard/definitions/insurance-companies'}
              >
                <Link href='/dashboard/definitions/insurance-companies'>
                  <Icons.settings className='mr-2' />
                  <span>Sigorta Şirketleri</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip='Sigorta Tipleri'
                isActive={pathname === '/dashboard/definitions/insurance-types'}
              >
                <Link href='/dashboard/definitions/insurance-types'>
                  <Icons.settings className='mr-2' />
                  <span>Sigorta Tipleri</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip='Ödeme Tipleri'
                isActive={pathname === '/dashboard/definitions/payment-types'}
              >
                <Link href='/dashboard/definitions/payment-types'>
                  <Icons.settings className='mr-2' />
                  <span>Ödeme Tipleri</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip='Ödeme Hesapları'
                isActive={pathname === '/dashboard/definitions/payment-accounts'}
              >
                <Link href='/dashboard/definitions/payment-accounts'>
                  <Icons.settings className='mr-2' />
                  <span>Ödeme Hesapları</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip='Para Birimleri'
                isActive={pathname === '/dashboard/definitions/currencies'}
              >
                <Link href='/dashboard/definitions/currencies'>
                  <Icons.settings className='mr-2' />
                  <span>Para Birimleri</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip='Ajanslar'
                isActive={pathname === '/dashboard/definitions/agencies'}
              >
                <Link href='/dashboard/definitions/agencies'>
                  <Icons.settings className='mr-2' />
                  <span>Ajanslar</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip='Servis Şirketleri'
                isActive={pathname === '/dashboard/definitions/service-companies'}
              >
                <Link href='/dashboard/definitions/service-companies'>
                  <Icons.settings className='mr-2' />
                  <span>Servis Şirketleri</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip='Servis Tipleri'
                isActive={pathname === '/dashboard/definitions/service-types'}
              >
                <Link href='/dashboard/definitions/service-types'>
                  <Icons.settings className='mr-2' />
                  <span>Servis Tipleri</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip='Tedarikçi Kategorileri'
                isActive={pathname === '/dashboard/definitions/supplier-categories'}
              >
                <Link href='/dashboard/definitions/supplier-categories'>
                  <Icons.settings className='mr-2' />
                  <span>Tedarikçi Kategorileri</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip='Lastik Markaları'
                isActive={pathname === '/dashboard/definitions/tire-brands'}
              >
                <Link href='/dashboard/definitions/tire-brands'>
                  <Icons.settings className='mr-2' />
                  <span>Lastik Markaları</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip='Lastik Modelleri'
                isActive={pathname === '/dashboard/definitions/tire-models'}
              >
                <Link href='/dashboard/definitions/tire-models'>
                  <Icons.settings className='mr-2' />
                  <span>Lastik Modelleri</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip='Araç Paketleri'
                isActive={pathname === '/dashboard/definitions/packages'}
              >
                <Link href='/dashboard/definitions/packages'>
                  <Icons.settings className='mr-2' />
                  <span>Araç Paketleri</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip='Lastik Tipleri'
                isActive={pathname === '/dashboard/definitions/tire-types'}
              >
                <Link href='/dashboard/definitions/tire-types'>
                  <Icons.settings className='mr-2' />
                  <span>Lastik Tipleri</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip='Lastik Pozisyonları'
                isActive={pathname === '/dashboard/definitions/tire-positions'}
              >
                <Link href='/dashboard/definitions/tire-positions'>
                  <Icons.settings className='mr-2' />
                  <span>Lastik Pozisyonları</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip='Lastik Durumları'
                isActive={pathname === '/dashboard/definitions/tire-conditions'}
              >
                <Link href='/dashboard/definitions/tire-conditions'>
                  <Icons.settings className='mr-2' />
                  <span>Lastik Durumları</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip='Tedarikçiler'
                isActive={pathname === '/dashboard/definitions/tyre-suppliers'}
              >
                <Link href='/dashboard/definitions/tyre-suppliers'>
                  <Icons.settings className='mr-2' />
                  <span>Tedarikçiler</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem></SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
