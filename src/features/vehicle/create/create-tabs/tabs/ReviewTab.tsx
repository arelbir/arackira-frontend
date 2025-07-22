'use client';

import { useFormContext, useWatch } from 'react-hook-form';
import { Card, CardTitle, CardHeader, CardContent } from '@/components/ui/card';
import { TabContentWrapper } from './components/TabContentWrapper';

export function ReviewTab() {
  const { control } = useFormContext();
  const allValues = useWatch({ control }); // Tüm form değerlerini izle

  return (
    <TabContentWrapper isEmpty={false} emptyMessage="">
      <Card>
        <CardHeader>
          <CardTitle>Form Özeti</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            Bu sekmede, girdiğiniz tüm verilerin bir özetini görebilirsiniz. Kaydetmeden önce bilgilerin doğruluğunu kontrol ediniz.
          </p>
          <pre className="bg-muted p-4 rounded-md text-sm">
            {JSON.stringify(allValues, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </TabContentWrapper>
  );
}
