'use client';

import { PlusCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { useCurrency } from '@/lib/currencyContext';
import { supabase } from '@/lib/supabase';

type SpendLog = {
  id: string;
  user_id: string;
  category: string;
  note: string | null;
  amount: number;
  date: string;
  payment_method: string;
  created_at: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<SpendLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { formatAmount } = useCurrency();

  const fetchLogs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Get the authenticated user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        throw new Error(authError.message || 'Authentication error');
      }
      
      if (!user) {
        toast.error('Please log in to view your spending logs');
        // Uncomment the line below to redirect to login page
        // router.push('/login');
        return;
      }
      
      // Fetch logs for the current user
      const { data: logs, error } = await supabase
        .from('spend_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });
      
      if (error) {
        throw new Error(error.message || 'Failed to fetch spending logs');
      }
      
      setLogs(logs || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch spending logs');
      toast.error('Failed to fetch spending logs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Your Spendings</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchLogs}
            disabled={isLoading}
            className="flex items-center gap-1"
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            Refresh
          </Button>
          <Link
            href="/dashboard/add"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 dark:bg-indigo-700 rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-800 transition-colors duration-200"
          >
            <PlusCircle size={18} />
            Add Spend
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-50 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">Loading your spending logs...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-50 dark:border-gray-700">
          <p className="text-red-500 dark:text-red-400">{error}</p>
          <Button onClick={fetchLogs} className="mt-4">
            Try Again
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {logs.length > 0 ? (
            logs.map((log) => (
              <div key={log.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-50 dark:border-gray-700 flex justify-between items-center transition-colors duration-200">
                <div>
                  <p className="font-semibold text-lg text-gray-800 dark:text-gray-100">{log.category}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{log.note || 'No note'}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {log.date} • {log.payment_method}
                  </p>
                </div>
                <p className="text-xl font-bold text-red-500 dark:text-red-400">-{formatAmount(log.amount)}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400">No spending logs yet.</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">Click 'Add Spend' to get started!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

