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
  SidebarRail,
  useSidebar
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
  IconCar,
  IconUsers,
  IconFileText,
  IconSettings,
  IconPalette,
  IconBuildingStore,
  IconCurrencyDollar,
  IconShield,
  IconCircle,
  IconTools,
  IconHome
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
  const { state, setOpen } = useSidebar();
  const isCollapsed = state === 'collapsed';
  const router = useRouter();
  
  // Collapsible menü durumları
  const [systemDefsOpen, setSystemDefsOpen] = React.useState(false);
  
  // Daraltılmış modda collapsible menüye tıklandığında sidebar'ı genişlet
  const handleCollapsibleClick = (menuSetter: React.Dispatch<React.SetStateAction<boolean>>) => {
    if (isCollapsed) {
      setOpen(true); // Sidebar'ı genişlet
      // Kısa bir gecikme ile menüyü aç
      setTimeout(() => menuSetter(true), 100);
    } else {
      // Normal collapsible davranış
      menuSetter((prev: boolean) => !prev);
    }
  };
  const handleSwitchTenant = (_tenantId: string) => {
    // Tenant switching functionality would be implemented here
  };

  const activeTenant = tenants[0];

  React.useEffect(() => {
    // Sidebar daraltıldığında tüm collapsible menüleri kapat
    if (isCollapsed) {
      setSystemDefsOpen(false);
    }
  }, [isCollapsed]);

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
        {/* Ana İşlem Modülleri */}
        <SidebarGroup>
          <SidebarGroupLabel>📊 Ana Modüller</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip='Genel Bakış'
                isActive={pathname === '/dashboard/overview'}
              >
                <Link href='/dashboard/overview'>
                  <Icons.dashboard className='mr-2' />
                  <span className='group-data-[collapsible=icon]:hidden'>Genel Bakış</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Araç Yönetimi */}
        <SidebarGroup>
          <SidebarGroupLabel>🚗 Araç Yönetimi</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip='Araçlar'
                isActive={pathname === '/dashboard/vehicles'}
              >
                <Link href='/dashboard/vehicles'>
                  <IconCar className='mr-2' />
                  <span className='group-data-[collapsible=icon]:hidden'>Araçlar</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Müşteri Yönetimi */}
        <SidebarGroup>
          <SidebarGroupLabel>👥 Müşteri Yönetimi</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip='Müşteriler'
                isActive={pathname === '/dashboard/clients'}
              >
                <Link href='/dashboard/clients'>
                  <IconUsers className='mr-2' />
                  <span className='group-data-[collapsible=icon]:hidden'>Müşteriler</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>



        {/* Gelecek Modüller */}
        <SidebarGroup>
          <SidebarGroupLabel>🔮 Geliştirilecek Modüller</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip='Sözleşme Yönetimi (Yakında)'
                isActive={pathname === '/dashboard/contracts'}
                className='opacity-60'
              >
                <Link href='/dashboard/contracts'>
                  <IconFileText className='mr-2' />
                  <span className='group-data-[collapsible=icon]:hidden'>Sözleşmeler (Yakında)</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip='Elden Çıkarma (Yakında)'
                isActive={pathname === '/dashboard/disposal'}
                className='opacity-60'
              >
                <Link href='/dashboard/disposal'>
                  <Icons.trash className='mr-2' />
                  <span className='group-data-[collapsible=icon]:hidden'>Elden Çıkarma (Yakında)</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip='Bakım Yönetimi (Yakında)'
                isActive={pathname === '/dashboard/maintenance'}
                className='opacity-60'
              >
                <Link href='/dashboard/maintenance'>
                  <IconTools className='mr-2' />
                  <span className='group-data-[collapsible=icon]:hidden'>Bakım (Yakında)</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip='Kiralama Yönetimi (Yakında)'
                isActive={pathname === '/dashboard/rental'}
                className='opacity-60'
              >
                <Link href='/dashboard/rental'>
                  <IconHome className='mr-2' />
                  <span className='group-data-[collapsible=icon]:hidden'>Kiralama (Yakında)</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        {/* Sistem Tanımları - Collapsible */}
        <SidebarGroup>
          <SidebarGroupLabel>⚙️ Sistem Tanımları</SidebarGroupLabel>
          <SidebarMenu>
            <Collapsible open={systemDefsOpen} onOpenChange={setSystemDefsOpen} className='group/collapsible'>
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton 
                    className='flex w-full items-center justify-between'
                    onClick={(e) => {
                      e.preventDefault();
                      handleCollapsibleClick(setSystemDefsOpen);
                    }}
                  >
                    <div className='flex items-center'>
                      <IconSettings className='mr-2 h-4 w-4' />
                      <span className='group-data-[collapsible=icon]:hidden'>Tüm Tanımlar</span>
                    </div>
                    {!isCollapsed && (
                      <IconChevronRight className='ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                    )}
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
              <SidebarMenu>
                {/* Araç Tanımları */}
                <Collapsible defaultOpen={false} open={isCollapsed ? false : undefined} className='group/vehicle-defs'>
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className='flex w-full items-center justify-between'>
                        <div className='flex items-center'>
                          <IconCar className='mr-2 h-4 w-4' />
                          <span className='group-data-[collapsible=icon]:hidden'>🚗 Araç Tanımları</span>
                        </div>
                        <IconChevronRight className='ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/vehicle-defs:rotate-90' />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild isActive={pathname === '/dashboard/definitions/brands'}>
                            <Link href='/dashboard/definitions/brands'>Markalar</Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild isActive={pathname === '/dashboard/definitions/models'}>
                            <Link href='/dashboard/definitions/models'>Modeller</Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild isActive={pathname === '/dashboard/definitions/vehicle-types'}>
                            <Link href='/dashboard/definitions/vehicle-types'>Araç Tipleri</Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild isActive={pathname === '/dashboard/definitions/vehicle-statuses'}>
                            <Link href='/dashboard/definitions/vehicle-statuses'>Araç Statüleri</Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild isActive={pathname === '/dashboard/definitions/fuel-types'}>
                            <Link href='/dashboard/definitions/fuel-types'>Yakıt Tipleri</Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild isActive={pathname === '/dashboard/definitions/transmissions'}>
                            <Link href='/dashboard/definitions/transmissions'>Vites Tipleri</Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild isActive={pathname === '/dashboard/definitions/colors'}>
                            <Link href='/dashboard/definitions/colors'>Renkler</Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>

                {/* Müşteri Tanımları */}
                <Collapsible defaultOpen={false} open={isCollapsed ? false : undefined} className='group/client-defs'>
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className='flex w-full items-center justify-between'>
                        <div className='flex items-center'>
                          <IconUsers className='mr-2 h-4 w-4' />
                          <span className='group-data-[collapsible=icon]:hidden'>Müşteri Tanımları</span>
                        </div>
                        <IconChevronRight className='ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/client-defs:rotate-90' />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild isActive={pathname === '/dashboard/definitions/client-types'}>
                            <Link href='/dashboard/definitions/client-types'>Müşteri Tipleri</Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild isActive={pathname === '/dashboard/definitions/branches'}>
                            <Link href='/dashboard/definitions/branches'>Ruhsat Sahibi Firmalar</Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>

                {/* Finansal Tanımlar */}
                <Collapsible defaultOpen={false} open={isCollapsed ? false : undefined} className='group/financial-defs'>
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className='flex w-full items-center justify-between'>
                        <div className='flex items-center'>
                          <IconCurrencyDollar className='mr-2 h-4 w-4' />
                          <span className='group-data-[collapsible=icon]:hidden'>Finansal Tanımlar</span>
                        </div>
                        <IconChevronRight className='ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/financial-defs:rotate-90' />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild isActive={pathname === '/dashboard/definitions/currencies'}>
                            <Link href='/dashboard/definitions/currencies'>Para Birimleri</Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild isActive={pathname === '/dashboard/definitions/payment-types'}>
                            <Link href='/dashboard/definitions/payment-types'>Ödeme Tipleri</Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild isActive={pathname === '/dashboard/definitions/payment-accounts'}>
                            <Link href='/dashboard/definitions/payment-accounts'>Ödeme Hesapları</Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>

                {/* Sigorta & Servis */}
                <Collapsible defaultOpen={false} open={isCollapsed ? false : undefined} className='group/insurance-defs'>
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className='flex w-full items-center justify-between'>
                        <div className='flex items-center'>
                          <IconShield className='mr-2 h-4 w-4' />
                          <span className='group-data-[collapsible=icon]:hidden'>Sigorta & Servis</span>
                        </div>
                        <IconChevronRight className='ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/insurance-defs:rotate-90' />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild isActive={pathname === '/dashboard/definitions/insurance-companies'}>
                            <Link href='/dashboard/definitions/insurance-companies'>Sigorta Şirketleri</Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild isActive={pathname === '/dashboard/definitions/insurance-types'}>
                            <Link href='/dashboard/definitions/insurance-types'>Sigorta Tipleri</Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild isActive={pathname === '/dashboard/definitions/service-companies'}>
                            <Link href='/dashboard/definitions/service-companies'>Servis Şirketleri</Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild isActive={pathname === '/dashboard/definitions/service-types'}>
                            <Link href='/dashboard/definitions/service-types'>Servis Tipleri</Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild isActive={pathname === '/dashboard/definitions/agencies'}>
                            <Link href='/dashboard/definitions/agencies'>Ajanslar</Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>

                {/* Lastik Yönetimi */}
                <Collapsible defaultOpen={false} open={isCollapsed ? false : undefined} className='group/tire-defs'>
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className='flex w-full items-center justify-between'>
                        <div className='flex items-center'>
                          <IconCircle className='mr-2 h-4 w-4' />
                          <span className='group-data-[collapsible=icon]:hidden'>Lastik Yönetimi</span>
                        </div>
                        <IconChevronRight className='ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/tire-defs:rotate-90' />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild isActive={pathname === '/dashboard/definitions/tire-brands'}>
                            <Link href='/dashboard/definitions/tire-brands'>Lastik Markaları</Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild isActive={pathname === '/dashboard/definitions/tire-models'}>
                            <Link href='/dashboard/definitions/tire-models'>Lastik Modelleri</Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild isActive={pathname === '/dashboard/definitions/tire-types'}>
                            <Link href='/dashboard/definitions/tire-types'>Lastik Tipleri</Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild isActive={pathname === '/dashboard/definitions/tire-positions'}>
                            <Link href='/dashboard/definitions/tire-positions'>Lastik Pozisyonları</Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild isActive={pathname === '/dashboard/definitions/tire-conditions'}>
                            <Link href='/dashboard/definitions/tire-conditions'>Lastik Durumları</Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild isActive={pathname === '/dashboard/definitions/tyre-suppliers'}>
                            <Link href='/dashboard/definitions/tyre-suppliers'>Lastik Tedarikçiler</Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>

                {/* Tedarikçi Yönetimi */}
                <Collapsible defaultOpen={false} open={isCollapsed ? false : undefined} className='group/supplier-defs'>
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className='flex w-full items-center justify-between'>
                        <div className='flex items-center'>
                          <IconBuildingStore className='mr-2 h-4 w-4' />
                          <span className='group-data-[collapsible=icon]:hidden'>Tedarikçi Yönetimi</span>
                        </div>
                        <IconChevronRight className='ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/supplier-defs:rotate-90' />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild isActive={pathname === '/dashboard/definitions/suppliers'}>
                            <Link href='/dashboard/definitions/suppliers'>Tedarikçiler</Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild isActive={pathname === '/dashboard/definitions/supplier-categories'}>
                            <Link href='/dashboard/definitions/supplier-categories'>Tedarikçi Kategorileri</Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild isActive={pathname === '/dashboard/definitions/packages'}>
                            <Link href='/dashboard/definitions/packages'>Araç Paketleri</Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              </SidebarMenu>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
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
