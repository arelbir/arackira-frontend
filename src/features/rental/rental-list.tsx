// Kiralama kayıtları listesi
'use client';
import React, { useState, useEffect } from 'react';
import {
  getAllRentals,
  createRental,
  updateRental,
  deleteRental,
  RentalRecord
} from './rentalService';
import { RentalFormValues } from './rental-schema';
import RentalActionsMenu from './rental-actions-menu';
import RentalDetailModal from './rental-detail-modal';
