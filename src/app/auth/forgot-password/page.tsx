"use client";
import { useState } from "react";
import { requestPasswordReset } from "@/services/authService";
import { ThemeSelector } from '@/components/theme-selector';
import { useThemeConfig } from '@/components/active-theme';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { activeTheme } = useThemeConfig();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    try {
      await requestPasswordReset(email);
      setMessage("Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.");
    } catch (err: any) {
      setError(err?.message || "Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-neutral-900 transition-colors px-2 py-8">
      <div className="w-full max-w-md p-8 md:p-10 bg-white dark:bg-neutral-800 rounded-2xl shadow-xl flex flex-col gap-6">
        <div className="flex items-center justify-between mb-2">
          <Link href="/" className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Ana Sayfaya Dön
          </Link>
          <ThemeSelector />
        </div>
        <h1 className="text-2xl font-bold mb-2 text-neutral-900 dark:text-white text-center">Şifremi Unuttum</h1>
        {message && (
          <div className="mb-3 p-3 bg-green-100 text-green-800 rounded-lg text-sm border border-green-300 text-center">{message}</div>
        )}
        {error && (
          <div className="mb-3 p-3 bg-red-100 text-red-800 rounded-lg text-sm border border-red-300 text-center">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          <input
            type="email"
            className={`w-full border px-4 py-3 rounded-lg mb-1 bg-neutral-50 dark:bg-neutral-900/30 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all ${email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) ? 'border-red-400' : 'border-neutral-300 dark:border-neutral-700'}`}
            placeholder="E-posta adresiniz"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          {email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) && (
            <div className="text-xs text-red-600 mb-2">Geçerli bir e-posta adresi girin.</div>
          )}
          <button
            type="submit"
            className={`w-full py-3 rounded-lg font-semibold shadow disabled:opacity-50 transition-colors
              ${activeTheme === 'blue' ? 'bg-blue-600 text-white' : ''}
              ${activeTheme === 'green' ? 'bg-green-600 text-white' : ''}
              ${activeTheme === 'amber' ? 'bg-amber-500 text-white' : ''}
              ${activeTheme === 'default' ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900' : ''}
              ${activeTheme === 'default-scaled' ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-lg py-4' : ''}
              ${activeTheme === 'blue-scaled' ? 'bg-blue-600 text-white text-lg py-4' : ''}
              ${activeTheme === 'mono-scaled' ? 'bg-neutral-700 text-white font-mono text-lg py-4' : ''}
            `}
            disabled={loading}
          >
            {loading ? "Gönderiliyor..." : "Sıfırlama Bağlantısı Gönder"}
          </button>
        </form>
      </div>
    </div>
  );
}