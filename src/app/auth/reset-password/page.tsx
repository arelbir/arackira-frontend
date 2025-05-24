"use client";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { resetPassword } from "@/services/authService";
import { ThemeSelector } from '@/components/theme-selector';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    if (password !== confirm) {
      setError("Şifreler eşleşmiyor.");
      setLoading(false);
      return;
    }
    try {
      await resetPassword(token, password);
      setMessage("Şifreniz başarıyla güncellendi. Giriş sayfasına yönlendiriliyorsunuz...");
      setTimeout(() => router.push("/auth/sign-in"), 2000);
    } catch (err: any) {
      setError(err?.message || "Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) return <div className="mt-20 text-center text-red-600">Geçersiz veya eksik token.</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-neutral-900 transition-colors">
      <div className="w-full max-w-md p-6 bg-white dark:bg-neutral-800 rounded shadow">
        <div className="flex justify-end mb-2">
          <ThemeSelector />
        </div>
        <h1 className="text-xl font-bold mb-4 text-neutral-900 dark:text-white">Yeni Şifre Belirle</h1>
        {message && (
          <div className="mb-3 p-2 bg-green-100 text-green-800 rounded text-sm border border-green-300">{message}</div>
        )}
        {error && (
          <div className="mb-3 p-2 bg-red-100 text-red-800 rounded text-sm border border-red-300">{error}</div>
        )}
        <form onSubmit={handleSubmit}>
        <input
          type="password"
          className={`w-full border px-3 py-2 rounded mb-1 ${password && password.length < 6 ? 'border-red-400' : ''}`}
          placeholder="Yeni şifre (en az 6 karakter)"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        {password && password.length < 6 && (
          <div className="text-xs text-red-600 mb-2">Şifre en az 6 karakter olmalı.</div>
        )}
        <input
          type="password"
          className={`w-full border px-3 py-2 rounded mb-1 ${confirm && confirm !== password ? 'border-red-400' : ''}`}
          placeholder="Yeni şifre (tekrar)"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          required
        />
        {confirm && confirm !== password && (
          <div className="text-xs text-red-600 mb-2">Şifreler eşleşmiyor.</div>
        )}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Kaydediliyor..." : "Şifreyi Güncelle"}
        </button>
        {message && <div className="mt-3 text-green-600">{message}</div>}
        {error && <div className="mt-3 text-red-600">{error}</div>}
      </form>
      </div>
    </div>
  );
}
