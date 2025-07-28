import React from 'react';
import { CheckCircle, Download, XCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { VehicleImportResult } from '../vehicle-import-service';

interface Step3ResultProps {
  result: VehicleImportResult;
  onReset: () => void;
}

export const Step3_Result: React.FC<Step3ResultProps> = ({ result, onReset }) => {

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center justify-center space-y-8 py-12 text-center">
      <div className="flex flex-col items-center space-y-2">
        <CheckCircle className="size-16 text-green-500" />
        <h3 className="text-3xl font-bold">Aktarım Tamamlandı</h3>
        <p className="text-muted-foreground">İçe aktarma işleminizin sonuçları aşağıdadır.</p>
      </div>

      <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Başarıyla Eklendi</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-600">{result.inserted}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Başarısız Oldu</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-red-600">{result.failed}</div>
            {result.failed > 0 && (
              <p className="pt-1 text-xs text-muted-foreground">
                Hata raporu otomatik olarak indirildi.
              </p>
            )}
          </CardContent>
        </Card>
      </div>



      <div className="flex w-full flex-col justify-center gap-4 border-t pt-6 sm:flex-row">
        <Button onClick={onReset} variant="outline" className="h-12 px-8 text-base w-full sm:w-auto">
          Yeni Aktarım Yap
        </Button>
        <Button asChild className="h-12 px-8 text-base w-full sm:w-auto">
          <Link href="/dashboard/vehicles">Araç Listesine Git</Link>
        </Button>
      </div>
    </div>
  );
};
