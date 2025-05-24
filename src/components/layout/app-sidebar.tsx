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
