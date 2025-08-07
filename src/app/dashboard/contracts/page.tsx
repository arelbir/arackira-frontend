import ContractList from '@/features/contract/ContractList';
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from '@/components/page-header';

const ContractsPage = () => {
  return (
    <div className="h-full">
      <PageHeader>
        <PageHeaderHeading>Sözleşmeler</PageHeaderHeading>
        <PageHeaderDescription>
          Mevcut sözleşmeleri yönetin, yeni sözleşme ekleyin veya mevcutları düzenleyin.
        </PageHeaderDescription>
      </PageHeader>
      <ContractList />
    </div>
  );
};

export default ContractsPage;
