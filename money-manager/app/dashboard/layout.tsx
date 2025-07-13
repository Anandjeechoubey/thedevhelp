'use client';

import type { User } from '@supabase/supabase-js';
import { Settings } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { CurrencyProvider } from '@/lib/currencyContext';
import { supabase } from '@/lib/supabase';

export default function DashboardLayout({
  children,
}: { 
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      } else {
        setUser(session.user);
        setLoading(false);
      }
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        router.push('/login');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <CurrencyProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-100 dark:border-gray-700">
          <div className="max-w-7xl mx-auto py-2 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Image 
                src="/money_manger_assets/logo-800x800.png" 
                alt="Money Manager Logo" 
                width={48} 
                height={48} 
                className="rounded-md bg-white dark:bg-gray-700"
              />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white hidden sm:block">Money Manager</h1>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-300">Hello, {user?.email}</span>
              <Link
                href="/dashboard/settings"
                className="p-2 text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center justify-center transition-colors duration-200"
                title="Settings"
              >
                <Settings size={20} />
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 dark:bg-indigo-700 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 dark:hover:bg-indigo-800 transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-4 md:mx-auto py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </CurrencyProvider>
  );
}
