import React, { useState } from 'react';
import { useBrand, useModel, useColor } from '@/features/definitions/hooks';

export default function VehicleCreatePage() {
  const { brands, loading: loadingBrands } = useBrand();
  const { models, loading: loadingModels } = useModel();
  const { colors, loading: loadingColors } = useColor();

  const [form, setForm] = useState({
    plate: '',
    brandId: '',
    modelId: '',
    colorId: '',
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Burada createVehicle gibi bir hook kullanılabilir.
    alert('Araç kaydedildi!');
  }

  return (
    <div>
      <h1>Yeni Araç Ekle</h1>
      <form onSubmit={handleSubmit}>
        <label>Plaka
          <input name="plate" value={form.plate} onChange={handleChange} required />
        </label>
        <label>Marka
          <select name="brandId" value={form.brandId} onChange={handleChange} required>
            <option value="">Seçiniz</option>
            {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </label>
        <label>Model
          <select name="modelId" value={form.modelId} onChange={handleChange} required>
            <option value="">Seçiniz</option>
            {models.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </label>
        <label>Renk
          <select name="colorId" value={form.colorId} onChange={handleChange} required>
            <option value="">Seçiniz</option>
            {colors.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </label>
        <button type="submit">Kaydet</button>
      </form>
    </div>
  );
}
