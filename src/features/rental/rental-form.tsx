// Kiralama formu - MaintenanceForm örnek alınarak
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { rentalSchema, RentalFormValues } from './rental-schema';


interface RentalFormProps {
  onSubmit: (data: RentalFormValues) => void;
  loading?: boolean;
  initialData?: Partial<RentalFormValues>;
}


 


