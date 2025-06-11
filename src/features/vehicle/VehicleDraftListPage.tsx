import React, { useEffect, useState } from 'react';
import { getDraftVehicles, deleteDraftVehicle, Vehicle } from './vehicleService';

const VehicleDraftListPage: React.FC = () => {
  const [drafts, setDrafts] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchDrafts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDraftVehicles();
      setDrafts(data);
    } catch (err: any) {
      setError(err.message || 'Taslaklar alınamadı');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDrafts();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bu taslak aracı silmek istediğinize emin misiniz?')) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await deleteDraftVehicle(id);
      setSuccess('Taslak araç silindi.');
      setDrafts(drafts.filter(d => d.id !== id));
    } catch (err: any) {
      setError(err.message || 'Taslak araç silinemedi');
    }
    setLoading(false);
  };

  // Taslaktan devam et: draftId ile create sayfasına yönlendir
  const handleContinue = (draftId: number) => {
    window.location.href = `/vehicles/create?draftId=${draftId}`;
  };


  return (
    <div className="max-w-2xl mx-auto py-8">
      <h2 className="text-xl font-bold mb-4">Taslak Araçlar</h2>
      {loading && <div>Yükleniyor...</div>}
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">{success}</div>}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Plaka</th>
            <th className="p-2 border">İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {drafts.length === 0 && !loading ? (
            <tr><td colSpan={3} className="text-center p-4">Hiç taslak araç yok.</td></tr>
          ) : (
            drafts.map(draft => (
              <tr key={draft.id}>
                <td className="p-2 border">{draft.id}</td>
                <td className="p-2 border">{draft.plate_number}</td>
                <td className="p-2 border flex gap-2">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded"
                    onClick={() => handleContinue(draft.id!)}
                    disabled={loading}
                  >Devam Et</button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded"
                    onClick={() => handleDelete(draft.id!)}
                    disabled={loading}
                  >Sil</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VehicleDraftListPage;
