'use client';

import { Moon, Sun } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTheme } from '@/lib/themeContext';
import { SUPPORTED_CURRENCIES, THEME_OPTIONS } from '@/lib/schemas';
import { supabase } from '@/lib/supabase';

export default function SettingsPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState('USD'); // Default currency
  const [selectedTheme, setSelectedTheme] = useState<typeof THEME_OPTIONS[number]>('system'); // Default theme
  
  // Handle theme selection with proper type casting
  const handleThemeChange = (value: string) => {
    if (THEME_OPTIONS.includes(value as any)) {
      setSelectedTheme(value as typeof THEME_OPTIONS[number]);
    }
  };

  // Fetch user preferences on page load
  useEffect(() => {
    async function fetchUserPreferences() {
      try {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          toast.error('You must be logged in to view settings');
          router.push('/login');
          return;
        }

        // Check if user has existing preferences
        const { data, error } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code == "PGRST116") {
          // User has no preferences
          setSelectedCurrency('USD');
          return;
        }

        if (error && error.code !== 'PGSQL_ERROR') {
          // Don't show error if it's just that no record was found
          console.error('Error fetching preferences:', error);
          toast.error('Failed to load preferences');
        }

        if (data) {
          // If user has existing preferences, set them in state
          setSelectedCurrency(data.currency);
          
          if (data.theme && THEME_OPTIONS.includes(data.theme)) {
            setSelectedTheme(data.theme);
          }
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserPreferences();
  }, [router]);

  const handleSavePreferences = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You must be logged in to update settings');
        router.push('/login');
        return;
      }

      const toastId = toast.loading('Saving preferences...');
      // Check if user already has preferences
      const { data, error: fetchError } = await supabase
        .from('user_preferences')
        .select('id')
        .eq('user_id', user.id)
        .single();

      let error;

      if (data) {
        // Update existing preferences
        const { error: updateError } = await supabase
          .from('user_preferences')
          .update({
            currency: selectedCurrency,
            // theme: selectedTheme,
          })
          .eq('user_id', user.id);

        error = updateError;
      } else {
        // Insert new preferences
        const { error: insertError } = await supabase
          .from('user_preferences')
          .insert([{
            user_id: user.id,
            currency: selectedCurrency,
            // theme: selectedTheme,
          }]);

        error = insertError;
      }

      if (error) {
        toast.error(error.message, { id: toastId });
        return;
      }

      // Update theme in context
      // setTheme(selectedTheme);

      toast.success('Preferences saved successfully!', { id: toastId });
    } catch (error) {
      toast.error('Failed to save preferences');
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Settings</h2>
        <Link href="/dashboard" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 hover:underline transition-colors duration-200">
          &larr; Back to Dashboard
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm dark:shadow-gray-900/30 border border-gray-50 dark:border-gray-700 transition-colors duration-200">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">User Preferences</h3>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none text-gray-900 dark:text-gray-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Currency</label>
            <Select 
              disabled={isLoading} 
              onValueChange={setSelectedCurrency} 
              value={selectedCurrency}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a currency" />
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_CURRENCIES.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    {currency.symbol} - {currency.name} ({currency.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500 dark:text-gray-400">This currency will be used throughout the application for displaying amounts.</p>
          </div>
          
          {/* <div className="space-y-2">
            <label className="text-sm font-medium leading-none text-gray-900 dark:text-gray-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Theme</label>
            <Select 
              disabled={isLoading} 
              onValueChange={handleThemeChange} 
              value={selectedTheme}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">
                  <div className="flex items-center gap-2">
                    <Sun size={16} />
                    <span>Light</span>
                  </div>
                </SelectItem>
                <SelectItem value="dark">
                  <div className="flex items-center gap-2">
                    <Moon size={16} />
                    <span>Dark</span>
                  </div>
                </SelectItem>
                <SelectItem value="system">
                  <div className="flex items-center gap-2">
                    <span>System</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500 dark:text-gray-400">Choose your preferred appearance theme.</p>
          </div> */}
          
          <Button 
            onClick={handleSavePreferences} 
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Preferences'}
          </Button>
        </div>
      </div>
    </div>
  );
}
