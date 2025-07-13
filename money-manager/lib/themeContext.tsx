'use client';

import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';

import { THEME_OPTIONS } from '@/lib/schemas';
import { supabase } from '@/lib/supabase';

type Theme = typeof THEME_OPTIONS[number];

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  const router = useRouter();

  // Function to apply theme to document
  const applyTheme = (newTheme: 'light' | 'dark') => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(newTheme);
    setResolvedTheme(newTheme);
  };

  // Function to resolve system preference
  const resolveSystemTheme = (): 'light' | 'dark' => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light'; // Default fallback
  };

  // Set theme and save to database
  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check if the user already has preferences
      const { data: existingPrefs } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (existingPrefs) {
        await supabase
          .from('user_preferences')
          .update({ theme: newTheme })
          .eq('user_id', user.id);
      } else {
        await supabase
          .from('user_preferences')
          .insert([{ user_id: user.id, theme: newTheme, currency: 'USD' }]);
      }
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  // Fetch initial theme from database or localStorage
  useEffect(() => {
    const fetchTheme = async () => {
      // Try to get theme from local storage first for quick display
      const localTheme = localStorage.getItem('theme') as Theme | null;
      if (localTheme && THEME_OPTIONS.includes(localTheme as any)) {
        setThemeState(localTheme);
      }

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: preferences } = await supabase
          .from('user_preferences')
          .select('theme')
          .eq('user_id', user.id)
          .single();

        if (preferences?.theme) {
          setThemeState(preferences.theme as Theme);
          localStorage.setItem('theme', preferences.theme);
        }
      } catch (error) {
        console.error('Error fetching theme preference:', error);
      }
    };

    fetchTheme();

    // Listen for theme changes via Supabase realtime
    const channel = supabase
      .channel('theme_changes')
      .on(
        'postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'user_preferences' 
        }, 
        async (payload: any) => {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;
          
          // Type check the payload
          if (payload.new && 
              typeof payload.new === 'object' && 
              'user_id' in payload.new && 
              'theme' in payload.new &&
              payload.new.user_id === user.id) {
            const newTheme = payload.new.theme as Theme;
            if (THEME_OPTIONS.includes(newTheme as any)) {
              setThemeState(newTheme);
              localStorage.setItem('theme', newTheme);
            }
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  // Apply theme whenever it changes
  useEffect(() => {
    // Ensure theme is applied immediately when component mounts
    if (typeof window !== 'undefined') {
      // Force immediate application of theme to prevent flicker
      if (theme === 'system') {
        const systemTheme = resolveSystemTheme();
        applyTheme(systemTheme);
        
        // Add system theme change listener
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
          if (theme === 'system') { // Only respond if still set to system
            applyTheme(resolveSystemTheme());
          }
        };
        
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
      } else {
        // Force the explicitly selected theme, overriding system preference
        applyTheme(theme as 'light' | 'dark');
      }
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
